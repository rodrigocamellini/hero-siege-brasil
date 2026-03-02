import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [nodes, setNodes] = useState([]);
    const [viewState, setViewState] = useState({ scale: 0.55, x: 20, y: 100 });
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const viewportRef = useRef(null);

    // Initial parsing
    useEffect(() => {
        const rows = rawMap.trim().split('\n');
        const maxRow = rows.length - 1;
        const initialNodes = [];

        rows.forEach((row, y) => {
            row.trim().split(/\s+/).forEach((cell, x) => {
                if (cell !== '--') {
                    const type = cell.toLowerCase();
                    const isM = type.startsWith('m');
                    const unlocked = y === maxRow;
                    
                    initialNodes.push({
                        id: `${x}-${y}`,
                        x, y,
                        type,
                        isM,
                        active: false,
                        unlocked
                    });
                }
            });
        });
        setNodes(initialNodes);
    }, []);

    // Toggle logic with neighbor check (runs when nodes change)
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
        <div className="hlt-wrapper">
            <button className="hlt-close-btn" onClick={() => navigate('/')}>
                ✕ Close
            </button>

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
    );
};

export default HeroLevelTree;
