import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import './HeroLevelTree.css';

const labelMap = { 
    'st':'STR','in':'INT','en':'ENG','vi':'VIT','de':'DEX','ar':'ARM',
    'h0':'H0','h1':'H1','h2':'H2','h3':'H3',
    'm1':'M1','m2':'M2','m3':'M3','m4':'M4','m5':'M5','m6':'M6','m7':'M7','m8':'M8','m9':'M9',
    'ma':'MA','mb':'MB','mc':'MC','md':'MD','me':'ME','mf':'MF','mg':'MG','mj':'MJ','mt':'MT','mw':'MW','mu':'MU'
};

const mythicData = {
    'm1': { name: 'Mastery of All Skills', desc: '+2 to All Skills' },
    'm2': { name: 'Grand Intellect', desc: '+15 Intelligence, +15% Magic Damage' },
    'm3': { name: 'Great Fortitude', desc: '+15 Vitality, +5% All Res' },
    'm4': { name: 'Colossal Strength', desc: '+15 Strength, +10% Armor' },
    'm5': { name: 'Fatal Dexterity', desc: '+15 Dexterity, +10% Atk Speed' },
    'm6': { name: 'Mana Flow', desc: '+10% Mana Regen, +20 Energy' },
    'm7': { name: 'Iron Skin', desc: '+25% Physical Damage Reduction' },
    'm8': { name: 'Godly Reflexes', desc: '+15% Dodge Chance' },
    'm9': { name: 'Life Steal Master', desc: '3% Life Steal on Hit' },
    'ma': { name: 'Ancient Knowledge', desc: '+5% Experience Gained' },
    'mb': { name: 'Blood Thirst', desc: '+10% Critical Strike Damage' },
    'mc': { name: 'Crystal Guard', desc: '+50 Elemental Resistance' },
    'md': { name: 'Death Dealer', desc: '+2% Chance to Deal Double Damage' },
    'me': { name: 'Ethereal Flow', desc: '-10% Cooldown Reduction' },
    'mf': { name: 'Force Field', desc: 'Grants a shield equal to 10% of Max HP' },
    'mg': { name: 'Giant Growth', desc: '+15% Increased Area of Effect' },
    'mj': { name: 'Justice Bringer', desc: '+10% Damage against Elites' },
    'mt': { name: 'Titan Grip', desc: '+5% Overall Physical Power' },
    'mw': { name: 'Wild Magic', desc: '+5% Skill Critical Chance' },
    'mu': { name: 'Ultimate Power', desc: '+1 to All Tier 4 Talents' }
};

const rawMap = `
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- mf -- -- -- me -- -- -- mt -- -- -- mw -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st -- -- -- de -- -- -- in -- -- -- en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st -- -- -- de -- -- -- in -- -- -- en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st -- -- -- de -- -- -- in -- -- -- en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st -- -- -- de -- -- -- in -- -- -- en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st -- -- -- de -- -- -- in -- -- -- en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar ar ar ar ar -- -- -- en en en en en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- ar -- -- -- en -- -- -- vi -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- ar -- -- -- en -- -- -- vi -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- md -- -- -- ar -- -- -- en -- -- -- mc -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar vi vi vi en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- mj vi vi st st -- -- -- -- -- -- -- -- ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st -- -- -- -- -- -- -- -- st -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st de de de vi st -- -- -- st -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- vi vi st st st st st -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- mb -- -- -- -- -- -- -- -- -- vi vi mg st -- -- -- st -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- m8 -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- st st -- m9 -- -- -- -- -- -- -- st st -- -- -- vi de vi -- -- -- -- -- -- -- -- -- -- -- -- -- m7 -- en en -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- st st st st -- -- -- -- -- -- -- de -- -- -- -- vi de vi -- -- -- -- -- -- -- -- -- -- -- -- -- en in en in -- -- -- -- -- -- --
-- -- -- -- -- -- -- ar de -- -- de -- -- -- -- -- -- -- de -- -- -- de de de en en -- -- -- -- -- -- -- -- -- -- -- -- en -- -- en en -- -- -- -- -- --
-- -- -- -- -- -- -- -- de -- -- de st -- -- -- -- -- -- de -- vi vi ar ar de en en vi vi -- -- -- -- -- -- -- -- -- in en -- -- en -- -- -- -- -- -- --
-- -- -- -- -- ar st st st -- -- -- st de de de de de de de de de de ar ar h2 en en de de de in in in in in in in in in -- -- -- en en en en -- -- -- --
-- -- -- -- ar de de de de de de st de -- -- -- -- -- -- -- -- de ar ar ar de en en en en -- in -- -- -- -- -- -- -- in en vi vi en en in in in -- -- --
-- -- -- -- ar de h1 st st st -- st -- -- -- -- -- -- -- -- -- -- -- ar ar de de de -- -- -- in -- -- -- -- -- -- -- -- en in in in in h3 vi in -- -- --
-- -- -- -- ar st st st -- st st st -- -- -- -- -- -- -- -- -- -- -- -- ar de en -- -- -- -- in -- -- -- -- -- -- -- -- en vi vi -- vi in vi in -- -- --
-- -- -- -- -- ar ar de -- -- -- ma -- -- -- -- -- -- -- -- -- -- -- -- ar de en -- -- -- in in -- -- -- -- -- -- -- -- m6 -- -- -- vi vi vi -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- en m5 vi vi -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar ar en en en en en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- -- en en en en in -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- -- -- -- -- -- in -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- -- -- -- -- -- in in in vi vi mu -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st vi en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- st vi en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- ar ar ar in in -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- vi vi ar in in -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- vi vi vi h0 st st st -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- vi vi in st st -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- m1 -- -- -- vi vi in st st -- -- -- m3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- en en in -- -- vi en de -- -- st st st -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- m2 -- in in -- st vi st -- de st -- m4 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- in in in vi in de de -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- de vi ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- de ar en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- de vi ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- de vi ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- vi st ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- de st ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- de st ar -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- vi st en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- vi st en -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- vi -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
`;

const HeroLevelTree = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [nodes, setNodes] = useState([]);
    // Adjust initial view state to center better with the new layout
    const [viewState, setViewState] = useState({ scale: 0.55, x: 20, y: 100 });
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const viewportRef = useRef(null);

    // Navbar state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDbOpen, setIsDbOpen] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const dbMenuRef = useRef(null);
    const builderMenuRef = useRef(null);
    const currentView = 'hero-level-tree'; // Pseudo-state for navbar highlighting

    // Close menus on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dbMenuRef.current && !dbMenuRef.current.contains(event.target)) {
                setIsDbOpen(false);
            }
            if (builderMenuRef.current && !builderMenuRef.current.contains(event.target)) {
                setIsBuilderOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initial parsing of rawMap to create nodes and load from URL
    useEffect(() => {
        const rows = rawMap.trim().split('\n');
        const maxRow = rows.length - 1;
        const initialNodes = [];

        // Check for ?tree= param
        const treeParam = searchParams.get('tree');
        let activeIds = new Set();
        
        if (treeParam) {
            try {
                const decoded = atob(treeParam);
                activeIds = new Set(decoded.split(','));
            } catch (e) {
                console.error("Failed to parse tree param", e);
            }
        }

        rows.forEach((row, y) => {
            row.trim().split(/\s+/).forEach((cell, x) => {
                if (cell !== '--') {
                    const type = cell.toLowerCase();
                    const isM = type.startsWith('m');
                    const id = `${x}-${y}`;
                    // If loading from URL, we start with unlocked = false (except base)
                    // and then run a pass to fix it.
                    // Or simpler: Just set active based on URL, and let the next logic fix unlocked.
                    
                    const isActive = activeIds.has(id);
                    const isBase = y === maxRow;
                    
                    initialNodes.push({
                        id,
                        x, y,
                        type,
                        isM,
                        active: isActive,
                        unlocked: isBase // Initial state, will be updated if loading from URL
                    });
                }
            });
        });

        // If we loaded from URL, we need to recalculate unlocked status for ALL nodes
        // because "unlocked" depends on neighbors being active.
        if (treeParam) {
            // Iterative approach to propagate unlock status?
            // Actually, the rule is: unlocked if neighbor is active.
            // So one pass is enough if we just check neighbor's active status.
            
            const updatedNodes = initialNodes.map(node => {
                if (node.unlocked) return node; // Already base

                const hasActiveNeighbor = initialNodes.some(other => 
                    other.active && (Math.abs(other.x - node.x) + Math.abs(other.y - node.y) === 1)
                );
                
                return { ...node, unlocked: hasActiveNeighbor };
            });
            setNodes(updatedNodes);
        } else {
            setNodes(initialNodes);
        }
    }, [searchParams]);

    // Toggle node logic with unlocked status update
    const toggleNode = (nodeId) => {
        setNodes(prevNodes => {
            const targetIndex = prevNodes.findIndex(n => n.id === nodeId);
            if (targetIndex === -1) return prevNodes;

            const target = prevNodes[targetIndex];
            if (!target.unlocked && !target.active) return prevNodes;

            // 1. Update active state of target
            const nextNodes = prevNodes.map((n, i) => i === targetIndex ? { ...n, active: !n.active } : n);
            const rows = rawMap.trim().split('\n');
            const maxRow = rows.length - 1;

            // 2. Update unlocked state for ALL nodes based on nextNodes
            return nextNodes.map(targetNode => {
                const isBase = targetNode.y === maxRow;
                
                if (isBase) return { ...targetNode, unlocked: true };

                // Check neighbors in nextNodes
                const hasActiveNeighbor = nextNodes.some(other => 
                    other.active && (Math.abs(other.x - targetNode.x) + Math.abs(other.y - targetNode.y) === 1)
                );

                let newUnlocked = targetNode.unlocked;
                if (hasActiveNeighbor) {
                    newUnlocked = true;
                } else if (!targetNode.active) {
                    newUnlocked = false;
                }
                
                return { ...targetNode, unlocked: newUnlocked };
            });
        });
    };

    // Calculate stats
    const stats = useMemo(() => {
        let s = { st:0, in:0, en:0, vi:0, de:0, ar:0 };
        let activeMythics = [];
        let points = 0;

        nodes.forEach(n => {
            if (n.active) {
                points++;
                if (n.isM && mythicData[n.type]) {
                    activeMythics.push(n.type);
                    if(n.type === 'm2') s.in += 15;
                    if(n.type === 'm3') s.vi += 15;
                    if(n.type === 'm4') s.st += 15;
                    if(n.type === 'm5') s.de += 15;
                } else if (!n.type.startsWith('h')) {
                    let p = n.type.substring(0,2);
                    if (s[p] !== undefined) s[p]++;
                }
            }
        });
        return { s, activeMythics, points };
    }, [nodes]);

    const [isSaving, setIsSaving] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const handleGenerateLink = () => {
        const activeIds = nodes.filter(n => n.active).map(n => n.id).join(',');
        const encoded = btoa(activeIds);
        const url = `${window.location.origin}${window.location.pathname}?tree=${encoded}`;
        
        setGeneratedLink(url);
        setShowShareModal(true);
        setCopySuccess(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

  const handleSaveTree = async () => {
    setIsSaving(true);
    try {
        const input = document.querySelector('.hlt-status-panel');
        const treeContainer = document.querySelector('.hlt-tree-container');
        
        if (!input || !treeContainer) return;

        // Capture Sidebar
        const sidebarCanvas = await html2canvas(input, {
            backgroundColor: '#0a0a0c',
            scale: 2,
            useCORS: true
        });
        const sidebarImgData = sidebarCanvas.toDataURL('image/png');

        // Capture Tree
        const maxX = Math.max(...nodes.map(n => n.x));
        const maxY = Math.max(...nodes.map(n => n.y));
        const treeWidth = (maxX + 2) * 50; 
        const treeHeight = (maxY + 2) * 50;

        const treeCanvas = await html2canvas(treeContainer, {
            backgroundColor: '#0f111a',
            scale: 1,
            width: treeWidth,
            height: treeHeight,
            windowWidth: treeWidth,
            windowHeight: treeHeight,
            useCORS: true,
            onclone: (clonedDoc) => {
                 const clonedContainer = clonedDoc.querySelector('.hlt-tree-container');
                 if (clonedContainer) {
                     clonedContainer.style.transform = 'none';
                     clonedContainer.style.width = `${treeWidth}px`;
                     clonedContainer.style.height = `${treeHeight}px`;
                     clonedContainer.style.position = 'relative';
                     clonedContainer.style.left = '0px';
                     clonedContainer.style.top = '0px';
                 }
            }
        });
        const treeImgData = treeCanvas.toDataURL('image/png');

        // Create PDF
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Background
        pdf.setFillColor(15, 17, 26);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        // Logo & Title
        const logoUrl = '/images/herosiege.png';
        const logoImg = new Image();
        logoImg.src = logoUrl;
        await new Promise(resolve => {
            logoImg.onload = resolve;
            logoImg.onerror = resolve;
        });
        
        try {
             pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);
        } catch (e) {}

        pdf.setFontSize(24);
        pdf.setTextColor(255, 255, 255);
        pdf.text("Hero Level Tree", 50, 25);
        pdf.setFontSize(14);
        pdf.setTextColor(200, 200, 200);
        pdf.text("Hero Siege Brasil - Build Snapshot", 50, 35);

        // Sidebar
        const sidebarW = 70;
        const sidebarH = (sidebarCanvas.height * sidebarW) / sidebarCanvas.width;
        pdf.addImage(sidebarImgData, 'PNG', 10, 50, sidebarW, sidebarH);

        // Tree
        const treeX = 90;
        const treeMaxWidth = pageWidth - 100;
        const treeMaxHeight = pageHeight - 60;
        
        let treeW = treeMaxWidth;
        let treeH = (treeCanvas.height * treeW) / treeCanvas.width;
        
        if (treeH > treeMaxHeight) {
            treeH = treeMaxHeight;
            treeW = (treeCanvas.width * treeH) / treeCanvas.height;
        }

        pdf.addImage(treeImgData, 'PNG', treeX, 50, treeW, treeH);

        pdf.save('hero-level-tree.pdf');

    } catch (err) {
        console.error("Error saving PDF:", err);
        alert("Erro ao salvar PDF. Tente novamente.");
    } finally {
        setIsSaving(false);
    }
  };

  const resetTree = () => {
        const rows = rawMap.trim().split('\n');
        const maxRow = rows.length - 1;
        setNodes(prev => prev.map(n => {
             const isBase = n.y === maxRow;
             return { ...n, active: false, unlocked: isBase };
        }));
    };

    // Drag and Zoom handlers
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging.current) return;
            setViewState(prev => ({
                ...prev,
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y
            }));
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleMouseDown = (e) => {
        if (e.target.closest('.hlt-node')) return; // Don't drag if clicking a node
        isDragging.current = true;
        dragStart.current = {
            x: e.clientX - viewState.x,
            y: e.clientY - viewState.y
        };
    };

    const handleWheel = (e) => {
        setViewState(prev => ({
            ...prev,
            scale: prev.scale * (e.deltaY > 0 ? 0.9 : 1.1)
        }));
    };

    return (
    <div className="bg-[#0f111a] h-screen text-gray-200 font-sans selection:bg-red-500 selection:text-white flex flex-col overflow-hidden">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0b0d14]/95 backdrop-blur-md border-b border-white/5 flex-none">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                            navigate('/');
                            setMobileMenuOpen(false);
                        }}
                    >
                        <img
                            src="/images/herosiege.png"
                            alt="Hero Siege Brasil"
                            className="block h-8 sm:h-9 w-auto"
                            style={{ imageRendering: 'auto' }}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-white/20 text-gray-200 hover:bg-white/10"
                            onClick={() => setMobileMenuOpen((v) => !v)}
                        >
                            <span className="sr-only">Abrir menu</span>
                            <span className="flex flex-col gap-[3px]">
                                <span className="block w-5 h-[2px] bg-current" />
                                <span className="block w-5 h-[2px] bg-current" />
                                <span className="block w-5 h-[2px] bg-current" />
                            </span>
                        </button>
                        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                            <button
                                onClick={() => navigate('/')}
                                className={`transition-colors ${currentView === 'home' ? 'text-orange-500' : 'hover:text-white'}`}
                            >
                                Home
                            </button>
                            <div
                                className="relative"
                                ref={dbMenuRef}
                                onMouseEnter={() => setIsDbOpen(true)}
                                onMouseLeave={() => setIsDbOpen(false)}
                            >
                                <button
                                    type="button"
                                    onClick={() => setIsDbOpen((v) => !v)}
                                    className={`transition-colors ${
                                        ['classes', 'items', 'relics', 'quests', 'augments'].includes(currentView) || isDbOpen
                                            ? 'text-orange-500'
                                            : 'hover:text-white'
                                    }`}
                                >
                                    DataBase
                                </button>
                                <div
                                    className={`absolute left-0 top-full w-44 bg-[#0b0d14] border border-white/10 rounded shadow-xl py-2 ${
                                        isDbOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                                    } transition`}
                                >
                                    {['Classes', 'Items', 'Runas', 'Relíquias', 'Chaos Tower', 'Mercenários', 'Chaves', 'Augments', 'Quests', 'Mineração', 'Gemas', 'Charms'].map((item) => {
                                        const route = item === 'Classes' ? '/classes' :
                                                      item === 'Items' ? '/items' :
                                                      item === 'Runas' ? '/runes' :
                                                      item === 'Relíquias' ? '/relics' :
                                                      item === 'Chaos Tower' ? '/chaos-tower' :
                                                      item === 'Mercenários' ? '/mercenarios' :
                                                      item === 'Chaves' ? '/chaves' :
                                                      item === 'Augments' ? '/augments' :
                                                      item === 'Quests' ? '/quests' :
                                                      item === 'Mineração' ? '/mineracao' :
                                                      item === 'Gemas' ? '/gems' :
                                                      item === 'Charms' ? '/charms' : '/';
                                        return (
                                            <button
                                                key={item}
                                                onClick={() => {
                                                    navigate(route);
                                                    setIsDbOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5"
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/blog')}
                                className={`transition-colors ${currentView === 'blog' ? 'text-orange-500' : 'hover:text-white'}`}
                            >
                                Blog
                            </button>
                            <div
                                className="relative"
                                ref={builderMenuRef}
                                onMouseEnter={() => setIsBuilderOpen(true)}
                                onMouseLeave={() => setIsBuilderOpen(false)}
                            >
                                <button
                                    type="button"
                                    onClick={() => setIsBuilderOpen((v) => !v)}
                                    className={`transition-colors ${
                                        currentView === 'builder' || currentView === 'hero-level-tree' || isBuilderOpen
                                            ? 'text-orange-500'
                                            : 'hover:text-white'
                                    }`}
                                >
                                    Builder
                                </button>
                                <div
                                    className={`absolute left-0 top-full w-44 bg-[#0b0d14] border border-white/10 rounded shadow-xl py-2 ${
                                        isBuilderOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                                    } transition`}
                                >
                                    <button
                                        onClick={() => {
                                            navigate('/forum');
                                            setIsBuilderOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5"
                                    >
                                        Forum
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/hero-skills');
                                            setIsBuilderOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5"
                                    >
                                        Hero Skills
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/hero-level-tree');
                                            setIsBuilderOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 ${
                                            currentView === 'hero-level-tree' ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Hero Level Tree
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/ether');
                                            setIsBuilderOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 flex items-center justify-between ${
                                            currentView === 'ether' ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <span>Ether</span>
                                        <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black ml-2 leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse">S9</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/incarnation');
                                            setIsBuilderOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 flex items-center justify-between ${
                                            currentView === 'incarnation' ? 'text-orange-500' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <span>Incarnation</span>
                                        <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black ml-2 leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse">S9</span>
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/equipe')}
                                className={`transition-colors ${currentView === 'equipe' ? 'text-orange-500' : 'hover:text-white'}`}
                            >
                                Equipe
                            </button>
                            <button
                                onClick={() => navigate('/contato')}
                                className={`transition-colors ${currentView === 'contact' ? 'text-orange-500' : 'hover:text-white'}`}
                            >
                                Contatos
                            </button>
                        </div>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-[#0b0d14] max-h-[80vh] overflow-y-auto">
                        <div className="max-w-7xl mx-auto px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-300 space-y-1">
                            <button className="block w-full text-left py-1" onClick={() => navigate('/')}>Home</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/classes')}>Classes</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/items')}>Items</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/runes')}>Runas</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/relics')}>Relíquias</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/chaos-tower')}>Chaos Tower</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/mercenarios')}>Mercenários</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/chaves')}>Chaves</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/augments')}>Augments</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/quests')}>Quests</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/mineracao')}>Mineração</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/gems')}>Gemas e Jóias</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/charms')}>Charms</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/blog')}>Blog</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/forum')}>Forum</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/hero-skills')}>Hero Skills</button>
                            <button className="block w-full text-left py-1 text-orange-500" onClick={() => setMobileMenuOpen(false)}>Hero Level Tree</button>
                            <button className="block w-full text-left py-1 flex items-center justify-between" onClick={() => { navigate('/ether'); setMobileMenuOpen(false); }}>
                                <span>Ether</span>
                                <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)]">S9</span>
                            </button>
                            <button className="block w-full text-left py-1 flex items-center justify-between" onClick={() => { navigate('/incarnation'); setMobileMenuOpen(false); }}>
                                <span>Incarnation</span>
                                <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)]">S9</span>
                            </button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/equipe')}>Equipe</button>
                            <button className="block w-full text-left py-1" onClick={() => navigate('/contato')}>Contatos</button>
                        </div>
                    </div>
                )}
            </nav>

            <div className="hlt-wrapper">
                <div className="hlt-status-panel">
                    <div className="hlt-points-spent">POINTS SPENT: <span>{stats.points}</span></div>
                    
                    <h2>MASTER STATUS</h2>
                    <div className="hlt-stat-item hlt-val-st"><span>STRENGTH</span><span className="hlt-stat-value">Bonus +{stats.s.st}</span></div>
                    <div className="hlt-stat-item hlt-val-in"><span>INTELLIGENCE</span><span className="hlt-stat-value">Bonus +{stats.s.in}</span></div>
                    <div className="hlt-stat-item hlt-val-en"><span>ENERGY</span><span className="hlt-stat-value">Bonus +{stats.s.en}</span></div>
                    <div className="hlt-stat-item hlt-val-vi"><span>VITALITY</span><span className="hlt-stat-value">Bonus +{stats.s.vi}</span></div>
                    <div className="hlt-stat-item hlt-val-de"><span>DEXTERITY</span><span className="hlt-stat-value">Bonus +{stats.s.de}</span></div>
                    <div className="hlt-stat-item hlt-val-ar"><span>ARMOR</span><span className="hlt-stat-value">Bonus +{stats.s.ar}</span></div>
                    
                    <div className="hlt-mythic-container">
                        <h3 style={{fontSize: '0.8rem', color: 'var(--mythic)', margin: '15px 0 5px 0', textTransform: 'uppercase'}}>Active Mythic Talents</h3>
                        <div className="hlt-mythic-list">
                            {stats.activeMythics.map(m => (
                                <div key={m} className="hlt-mythic-box">
                                    <span className="hlt-mythic-name">{mythicData[m].name}</span>
                                    <span className="hlt-mythic-desc">{mythicData[m].desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="hlt-save-btn" onClick={handleSaveTree} disabled={isSaving}>
                        {isSaving ? 'SAVING...' : 'SALVAR ÁRVORE'}
                    </button>
                    <button className="hlt-share-btn" onClick={handleGenerateLink}>
                        GERAR LINK
                    </button>
                    <button className="hlt-reset-btn" onClick={resetTree}>RESET TREE</button>
                </div>
                
                <div 
                    className="hlt-viewport" 
                    id="viewport" 
                    ref={viewportRef}
                    onMouseDown={handleMouseDown}
                    onWheel={handleWheel}
                >
                    <div 
                        className="hlt-tree-container" 
                        style={{ transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})` }}
                    >
                        {nodes.map(node => (
                            <div
                                key={node.id}
                                className={`hlt-node ${node.type} ${node.isM ? 'mythic' : ''} ${node.active ? 'active' : ''} ${node.unlocked ? 'unlocked' : ''} ${['h0','h1','h2','h3'].includes(node.type) ? node.type : ''}`}
                                style={{ left: `${node.x * 50}px`, top: `${node.y * 50}px` }}
                                onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
                            >
                                {labelMap[node.type] || node.type.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#13151f] border border-blue-500/30 rounded-lg p-6 w-[90%] max-w-lg shadow-[0_0_50px_rgba(59,130,246,0.2)] relative transform transition-all scale-100">
                        <button 
                            onClick={() => setShowShareModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider">Link Gerado!</h3>
                            <p className="text-gray-400 text-sm text-center">
                                Sua build foi salva e está pronta para ser compartilhada. Copie o link abaixo:
                            </p>
                            
                            <div className="w-full flex gap-2 mt-2">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={generatedLink} 
                                    className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
                                />
                                <button 
                                    onClick={copyToClipboard}
                                    className={`px-4 py-2 rounded font-bold text-sm transition-all ${copySuccess ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                >
                                    {copySuccess ? 'COPIADO!' : 'COPIAR'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-[#0b0d14] border-t border-white/5 py-8 flex-none z-50 relative">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-50 hover:opacity-100 transition-opacity">
                    <div className="text-sm text-gray-500">
                        Hero Siege Brasil 2026© Este site não é afiliado à Panic Art Studios. Todos os assets e dados pertencem aos seus respectivos donos.
                    </div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="https://discord.gg/herosiegeofficial" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">Discord</a>
                        <a href="https://store.steampowered.com/app/269210/Hero_Siege/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">Steam</a>
                        <a href="https://www.panicartstudios.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">PAS</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HeroLevelTree;
