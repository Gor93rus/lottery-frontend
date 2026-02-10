import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ReferralTree.css';

export interface ReferralNode {
  id: string;
  name: string;
  earned: number;
  isActive: boolean;
  joinedAt: Date;
  children?: ReferralNode[];
  level: number;
}

interface ReferralTreeProps {
  rootUser?: string;
  maxLevels?: number;
}

// Generate mock referral tree
const generateMockTree = (level: number = 1, maxLevel: number = 3): ReferralNode[] => {
  if (level > maxLevel) return [];

  const names = [
    'Александр',
    'Мария',
    'Дмитрий',
    'Анна',
    'Сергей',
    'Елена',
    'Иван',
    'Ольга',
    'Андрей',
    'Татьяна',
  ];

  const count = level === 1 ? 5 : level === 2 ? 8 : 10;
  const nodes: ReferralNode[] = [];

  for (let i = 0; i < count; i++) {
    const isActive = Math.random() > 0.3;
    const earned = Math.floor(Math.random() * 500) + 50;
    const daysAgo = Math.floor(Math.random() * 30) + level * 5;
    const joinedAt = new Date();
    joinedAt.setDate(joinedAt.getDate() - daysAgo);

    nodes.push({
      id: `${level}-${i}`,
      name: names[Math.floor(Math.random() * names.length)] + i,
      earned,
      isActive,
      joinedAt,
      level,
      children: level < maxLevel ? generateMockTree(level + 1, maxLevel) : [],
    });
  }

  return nodes;
};

function ReferralTreeNode({
  node,
  isExpanded,
  onToggle,
}: {
  node: ReferralNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const initial = node.name.charAt(0).toUpperCase();

  return (
    <motion.div
      className="tree-node-wrapper"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`tree-node ${node.isActive ? 'active' : 'inactive'}`}
        onClick={hasChildren ? onToggle : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}
      >
        <div className="node-avatar">
          <span className="avatar-letter">{initial}</span>
          {node.isActive && <div className="active-indicator" />}
        </div>

        <div className="node-content">
          <div className="node-name">{node.name}</div>
          <div className="node-details">
            <span className="node-earned">+{node.earned} TON</span>
            <span className="node-date">
              {node.joinedAt.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>

        {hasChildren && (
          <div className="node-expand-icon">
            <motion.span
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▶
            </motion.span>
          </div>
        )}
      </motion.div>

      {hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="node-children"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {node.children!.map((child) => (
                <NestedNode key={child.id} node={child} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function NestedNode({ node }: { node: ReferralNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <ReferralTreeNode node={node} isExpanded={expanded} onToggle={() => setExpanded(!expanded)} />
  );
}

function ReferralTree({ rootUser = 'Вы', maxLevels = 3 }: ReferralTreeProps) {
  const [treeData] = useState(() => generateMockTree(1, maxLevels));

  // Calculate statistics
  const totalReferrals = treeData.reduce((sum, node) => {
    const level1 = 1;
    const level2 = node.children?.length || 0;
    const level3 = node.children?.reduce((s, c) => s + (c.children?.length || 0), 0) || 0;
    return sum + level1 + level2 + level3;
  }, 0);

  const level1Count = treeData.length;
  const level2Count = treeData.reduce((sum, node) => sum + (node.children?.length || 0), 0);
  const level3Count = treeData.reduce(
    (sum, node) => sum + (node.children?.reduce((s, c) => s + (c.children?.length || 0), 0) || 0),
    0
  );

  return (
    <motion.div
      className="referral-tree"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="tree-header">
        <h3 className="tree-title">🌳 Дерево рефералов</h3>
        <p className="tree-subtitle">Ваша реферальная сеть до {maxLevels} уровней</p>
      </div>

      {/* Root Node (You) */}
      <div className="root-node">
        <div className="node-avatar root">
          <span className="avatar-letter">{rootUser.charAt(0)}</span>
          <div className="active-indicator" />
        </div>
        <div className="node-content">
          <div className="node-name root-name">{rootUser}</div>
          <div className="node-subtitle">Корневой пользователь</div>
        </div>
      </div>

      {/* Connection Line */}
      <div className="connection-line" />

      {/* Level 1 Referrals */}
      <div className="tree-children">
        {treeData.map((node) => (
          <NestedNode key={node.id} node={node} />
        ))}
      </div>

      {/* Statistics */}
      <div className="tree-stats">
        <div className="stats-title">📊 Статистика сети</div>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Всего рефералов</div>
            <div className="stat-number">{totalReferrals}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Уровень 1</div>
            <div className="stat-number">{level1Count}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Уровень 2</div>
            <div className="stat-number">{level2Count}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Уровень 3</div>
            <div className="stat-number">{level3Count}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ReferralTree;
