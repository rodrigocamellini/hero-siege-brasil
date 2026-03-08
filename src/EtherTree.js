import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { rawData, connections, CENTER_ORIGIN } from './EtherNodesData';

// Constantes de Estilo e Configuração
const NODE_RADIUS = 10;
const NODE_HIT_RADIUS = 15;
const COLOR_ACTIVE = '#00f2ff';
const COLOR_INACTIVE = '#1a1a2e';
const COLOR_CORE = '#ffcc00';

// Compression Helpers
const compressNodes = (activeSet, totalNodes) => {
    if (activeSet.size <= 1 && activeSet.has(0)) return ''; // Only core active

    const numBytes = Math.ceil(totalNodes / 8);
    const bytes = new Uint8Array(numBytes);

    activeSet.forEach(idx => {
        const byteIndex = Math.floor(idx / 8);
        const bitIndex = idx % 8;
        bytes[byteIndex] |= (1 << bitIndex);
    });

    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return '~' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const decompressNodes = (encoded, totalNodes) => {
    try {
        if (!encoded.startsWith('~')) return null;

        const base64 = encoded.slice(1).replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;

        const binary = atob(paddedBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        const activeIds = new Set();
        for (let idx = 0; idx < totalNodes; idx++) {
             const byteIndex = Math.floor(idx / 8);
             const bitIndex = idx % 8;
             if (byteIndex < bytes.length && (bytes[byteIndex] & (1 << bitIndex))) {
                 activeIds.add(idx);
             }
        }
        return activeIds;
    } catch (e) {
        console.error("Error decompressing tree:", e);
        return null;
    }
};

const EtherTree = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Estado dos nós: Set de IDs ativos
    // Nó 0 (Core) sempre ativo
    const [activeNodes, setActiveNodes] = useState(new Set([0]));
    
    const [nodeData, setNodeData] = useState({}); // Dados do Firestore (detalhes das skills)
    const [hoveredNode, setHoveredNode] = useState(null);
    
    // Estado para o Modal de Confirmação
    const [showResetModal, setShowResetModal] = useState(false);
    const [showActivateAllModal, setShowActivateAllModal] = useState(false);

    // Estado para Share
    const [showShareModal, setShowShareModal] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    // Configurações (carregadas do Firestore)
    const [maxPoints, setMaxPoints] = useState(60);
    const [infinitePoints, setInfinitePoints] = useState(false);
    
    // Viewport State (Pan & Zoom)
    // Inicializar centralizado
    const [transform, setTransform] = useState({ 
        k: 0.8, // scale
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
    });
    
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Lógica de Grafo: Construir lista de adjacência para performance
    const adjacencyList = useMemo(() => {
        const adj = Array.from({ length: rawData.length }, () => []);
        connections.forEach(({ from, to }) => {
            if (from < rawData.length && to < rawData.length) {
                adj[from].push(to);
                adj[to].push(from);
            }
        });
        return adj;
    }, []);

    // Função auxiliar: Verificar conectividade de um conjunto de nós
    const checkFullConnectivity = (nodeSet) => {
        if (!nodeSet.has(0)) return false;
        if (nodeSet.size === 1) return true; // Apenas Core

        const visited = new Set([0]);
        const queue = [0];
        
        while (queue.length > 0) {
            const current = queue.shift();
            const neighbors = adjacencyList[current];
            neighbors.forEach(neighbor => {
                if (nodeSet.has(neighbor) && !visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            });
        }
        return visited.size === nodeSet.size;
    };

    // Carregar dados do Firestore (Nodes e Config)
    useEffect(() => {
        const unsubNodes = onSnapshot(collection(db, 'ether_tree_nodes'), (snap) => {
            const data = {};
            snap.forEach(doc => {
                data[doc.id] = doc.data();
            });
            setNodeData(data);
        });

        const loadConfig = async () => {
             try {
                 const docRef = doc(db, 'config', 'ether_tree');
                 const snap = await getDoc(docRef);
                 if (snap.exists()) {
                     const data = snap.data();
                     if (data.maxPoints !== undefined) setMaxPoints(data.maxPoints);
                     if (data.infinitePoints !== undefined) setInfinitePoints(data.infinitePoints);
                 }
             } catch (e) {
                 console.error("Erro ao carregar config:", e);
             }
        };
        loadConfig();

        return () => unsubNodes();
    }, []);

    // Inicializar activeNodes da URL
    useEffect(() => {
        const treeParam = searchParams.get('tree');
        if (treeParam) {
            let ids = null;
            if (treeParam.startsWith('~')) {
                const decompressed = decompressNodes(treeParam, rawData.length);
                if (decompressed) ids = decompressed;
            } else {
                try {
                    const json = atob(treeParam.replace(/-/g, '+').replace(/_/g, '/'));
                    const parsed = JSON.parse(json);
                    if (Array.isArray(parsed)) ids = new Set(parsed);
                } catch (e) {
                    console.error("Erro ao carregar árvore da URL:", e);
                }
            }

            if (ids) {
                const validIds = new Set();
                ids.forEach(id => {
                    if (id >= 0 && id < rawData.length) validIds.add(id);
                });
                validIds.add(0);
                
                if (checkFullConnectivity(validIds)) {
                    setActiveNodes(validIds);
                } else {
                    console.warn("Árvore inválida na URL, resetando.");
                    setActiveNodes(new Set([0]));
                }
            }
        } else {
            const saved = localStorage.getItem('etherTree_active');
            if (saved) {
                try {
                    const ids = JSON.parse(saved);
                    const validIds = new Set(ids);
                    validIds.add(0);
                    if (checkFullConnectivity(validIds)) setActiveNodes(validIds);
                } catch (e) {
                    console.error("Erro ao ler localStorage", e);
                }
            }
        }
    }, [searchParams]);

    // Atualizar URL quando activeNodes mudar
    useEffect(() => {
        const encoded = compressNodes(activeNodes, rawData.length);
        const currentParam = searchParams.get('tree');
        
        if (encoded !== currentParam && (encoded || currentParam)) {
            if (encoded) setSearchParams({ tree: encoded }, { replace: true });
            else setSearchParams({}, { replace: true });
        }
        
        localStorage.setItem('etherTree_active', JSON.stringify(Array.from(activeNodes)));
    }, [activeNodes, setSearchParams]);

    // Lógica de Toggle
    const handleNodeClick = (id) => {
        if (id === 0) return; // Core não pode ser desativado

        const newSet = new Set(activeNodes);
        const isActive = newSet.has(id);

        if (!isActive) {
            // Verificar pontos
            if (!infinitePoints) {
                const currentPoints = activeNodes.size - 1;
                if (currentPoints >= maxPoints) return; // Limite atingido
            }

            const neighbors = adjacencyList[id];
            const hasActiveNeighbor = neighbors.some(n => activeNodes.has(n));
            
            if (hasActiveNeighbor) {
                newSet.add(id);
                setActiveNodes(newSet);
            }
        } else {
            newSet.delete(id);
            if (checkFullConnectivity(newSet)) {
                setActiveNodes(newSet);
            }
        }
    };

    const handleGenerateLink = () => {
        const compressed = compressNodes(activeNodes, rawData.length);
        const url = `${window.location.origin}${window.location.pathname}?tree=${compressed}`;
        setGeneratedLink(url);
        setShowShareModal(true);
        setCopySuccess(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    // Handlers de Mouse para Pan/Zoom
    const handleWheel = (e) => {
        // Zoom focado no centro da tela por simplicidade ou na posição do mouse
        // Vamos fazer zoom simples no centro por enquanto para manter estabilidade
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setTransform(prev => ({ ...prev, k: prev.k * delta }));
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) { // Botão esquerdo
            isDragging.current = true;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging.current) {
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    // Renderização
    return (
        <div 
            className="w-full h-full bg-[#020205] overflow-hidden relative cursor-crosshair select-none"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={containerRef}
        >
            {/* Toolbar UI */}
            <div className="absolute top-5 right-5 z-50 pointer-events-none">
                <div className="bg-[#000f1e]/90 border border-[#00f2ff] rounded-lg p-4 shadow-[0_0_20px_rgba(0,242,255,0.2)] backdrop-blur-sm w-80 pointer-events-auto">
                    <h3 className="text-[#00f2ff] text-sm border-b border-[#00f2ff]/30 pb-2 mb-2 uppercase tracking-wider font-bold">
                        Detalhes do Node
                    </h3>
                    {hoveredNode !== null ? (
                        (() => {
                            const node = rawData[hoveredNode] || {};
                            const dbData = nodeData[hoveredNode] || {};
                            const name = dbData.name || node.name || (hoveredNode === 0 ? "Ether Core" : `Node ${hoveredNode}`);
                            const description = dbData.description || node.description || "No description available.";
                            const isActive = activeNodes.has(hoveredNode);

                            return (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-[#00f2ff]/60 text-[10px] uppercase block">ID</span>
                                            <span className="text-white font-mono text-xs font-bold">#{hoveredNode}</span>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${isActive ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                                            {isActive ? "ATIVO" : "INATIVO"}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <span className="text-[#00f2ff]/60 text-[10px] uppercase block mb-1">Nome</span>
                                        <span 
                                            className="text-[#FFD700] font-bold text-base leading-tight block"
                                            style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}
                                        >
                                            {name}
                                        </span>
                                    </div>

                                    <div className="bg-[#001a33]/50 p-2 rounded border border-[#00f2ff]/20">
                                        <span className="text-[#00f2ff]/60 text-[10px] uppercase block mb-1">Efeito</span>
                                        <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="text-gray-500 text-xs italic text-center py-4">
                            Passe o mouse sobre um nó para ver detalhes
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#000f1e]/95 border border-[#00f2ff] rounded-full px-6 py-3 shadow-[0_0_30px_rgba(0,242,255,0.2)] backdrop-blur-sm">
                <div className="text-sm font-bold min-w-[120px]">
                    <span className="text-gray-400">Pontos: </span>
                    <span className="text-white drop-shadow-[0_0_10px_#00f2ff]">
                        {activeNodes.size - 1}
                        {infinitePoints ? ' / ∞' : ` / ${maxPoints}`}
                    </span>
                </div>
                <button 
                    onClick={() => setShowResetModal(true)}
                    className="px-4 py-1.5 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition text-xs font-bold uppercase tracking-wider"
                >
                    Resetar
                </button>
                <button 
                    onClick={() => setShowActivateAllModal(true)}
                    className="px-4 py-1.5 rounded-full border border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white transition text-xs font-bold uppercase tracking-wider"
                >
                    Ativar Todos
                </button>
                <button 
                    onClick={handleGenerateLink}
                    className="px-4 py-1.5 rounded-full border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-white transition text-xs font-bold uppercase tracking-wider"
                >
                    Compartilhar
                </button>
            </div>

            {/* Modal de Confirmação de Reset */}
            {showResetModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#050510] border-2 border-[#00f2ff] p-8 rounded-xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,242,255,0.3)]">
                        <h2 className="text-2xl font-bold text-[#00f2ff] mb-4 uppercase tracking-widest">Reiniciar Árvore?</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Isso desativará todos os pontos, mantendo apenas o <span className="text-[#ffcc00] font-bold">Núcleo Central</span> ativo.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => setShowResetModal(false)}
                                className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition font-bold uppercase tracking-wide"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    setActiveNodes(new Set([0]));
                                    setShowResetModal(false);
                                }}
                                className="px-6 py-2 rounded-lg bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Ativar Todos */}
            {showActivateAllModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#050510] border-2 border-green-500 p-8 rounded-xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                        <h2 className="text-2xl font-bold text-green-500 mb-4 uppercase tracking-widest">Ativar Todos?</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Isso ativará <span className="text-green-400 font-bold">todos os pontos</span> da árvore instantaneamente.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => setShowActivateAllModal(false)}
                                className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition font-bold uppercase tracking-wide"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    // Ativar todos os nós (0 até rawData.length - 1)
                                    setActiveNodes(new Set(rawData.map((_, i) => i)));
                                    setShowActivateAllModal(false);
                                }}
                                className="px-6 py-2 rounded-lg bg-green-500/10 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition font-bold uppercase tracking-wide shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Share */}
            {showShareModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#050510] border-2 border-[#00f2ff] p-8 rounded-xl max-w-lg w-full text-center shadow-[0_0_50px_rgba(0,242,255,0.3)]">
                        <h2 className="text-2xl font-bold text-[#00f2ff] mb-4 uppercase tracking-widest">Compartilhar Build</h2>
                        <div className="bg-black/50 p-4 rounded border border-[#00f2ff]/30 mb-6 flex items-center gap-2">
                            <input 
                                type="text" 
                                value={generatedLink} 
                                readOnly 
                                className="bg-transparent border-none outline-none text-gray-300 w-full font-mono text-sm"
                            />
                            <button 
                                onClick={copyToClipboard}
                                className="bg-[#00f2ff]/20 hover:bg-[#00f2ff]/40 text-[#00f2ff] p-2 rounded transition font-bold text-xs uppercase"
                            >
                                {copySuccess ? "Copiado!" : "Copiar"}
                            </button>
                        </div>
                        <button 
                            onClick={() => setShowShareModal(false)}
                            className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition font-bold uppercase tracking-wide"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/* Canvas Container (Transform Layer) */}
            <div 
                className="absolute top-0 left-0 w-full h-full origin-top-left will-change-transform"
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})` 
                }}
            >
                {/* SVG Connections Layer */}
                <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    {connections.map((conn, idx) => {
                        const n1 = rawData[conn.from];
                        const n2 = rawData[conn.to];
                        
                        if (!n1 || !n2) return null;

                        const active1 = activeNodes.has(conn.from);
                        const active2 = activeNodes.has(conn.to);
                        const isActive = active1 && active2;

                        return (
                            <line 
                                key={idx}
                                x1={n1.x - CENTER_ORIGIN.x} 
                                y1={n1.y - CENTER_ORIGIN.y} 
                                x2={n2.x - CENTER_ORIGIN.x} 
                                y2={n2.y - CENTER_ORIGIN.y} 
                                stroke={isActive ? COLOR_ACTIVE : "rgba(0, 242, 255, 0.5)"}
                                strokeWidth={isActive ? 3 : 2}
                                strokeLinecap="round"
                                style={{
                                    filter: isActive ? 'url(#glow)' : 'none',
                                    transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
                                    opacity: isActive ? 1 : 0.8
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Nodes Layer */}
                {rawData.map((node, idx) => {
                    const isActive = activeNodes.has(idx);
                    const isCore = idx === 0;
                    const x = node.x - CENTER_ORIGIN.x;
                    const y = node.y - CENTER_ORIGIN.y;
                    
                    return (
                        <div
                            key={idx}
                            className="absolute rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                                left: x,
                                top: y,
                                width: NODE_RADIUS * 2,
                                height: NODE_RADIUS * 2,
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: isCore ? COLOR_CORE : (isActive ? COLOR_ACTIVE : COLOR_INACTIVE),
                                boxShadow: isActive ? `0 0 10px ${isCore ? COLOR_CORE : COLOR_ACTIVE}` : 'none',
                                border: isActive ? '2px solid white' : `1px solid ${COLOR_ACTIVE}33`,
                                zIndex: isActive ? 10 : 1,
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setHoveredNode(idx)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNodeClick(idx);
                            }}
                        />
                    );
                })}
            </div>

            {/* Tooltip Overlay */}
            {hoveredNode !== null && rawData[hoveredNode] && (
                (() => {
                    const node = rawData[hoveredNode];
                    // Dados do Firestore têm prioridade, senão usa do arquivo
                    const dbData = nodeData[hoveredNode] || {};
                    const name = dbData.name || node.name || `Node ${hoveredNode}`;
                    const description = dbData.description || node.description || "No description";
                    
                    // Calcular posição na tela para o tooltip acompanhar o nó
                    const screenX = (node.x - CENTER_ORIGIN.x) * transform.k + transform.x;
                    const screenY = (node.y - CENTER_ORIGIN.y) * transform.k + transform.y;
                    
                    return (
                        <div 
                            className="absolute pointer-events-none z-50 bg-black/90 border border-cyan-500/50 p-4 rounded-lg shadow-[0_0_20px_rgba(0,242,255,0.2)] backdrop-blur-sm min-w-[300px]"
                            style={{
                                left: screenX,
                                top: screenY - (15 * transform.k), // Offset baseado no raio e zoom
                                transform: 'translate(-50%, -100%)',
                                marginTop: '-10px'
                            }}
                        >
                            <h3 className="text-[#FFD700] font-bold text-lg mb-1 border-b border-cyan-500/30 pb-1">{name}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{description}</p>
                            <div className="mt-3 flex items-center justify-between text-xs font-mono text-gray-500 border-t border-gray-800 pt-2">
                                <span>ID: {hoveredNode}</span>
                                {activeNodes.has(hoveredNode) ? (
                                    <span className="text-green-400 font-bold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        ATIVO
                                    </span>
                                ) : (
                                    <span className="text-gray-600">INATIVO</span>
                                )}
                            </div>
                        </div>
                    );
                })()
            )}
        </div>
    );
};

export default EtherTree;
