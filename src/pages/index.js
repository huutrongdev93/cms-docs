import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import AuthorCard from '../components/AuthorCard/AuthorCard';
import {
    Puzzle, Webhook, ShoppingCart, MapPin, PaintbrushVertical, Zap,
    Package, Layers, ShieldCheck, Database, Globe, Terminal,
    Cpu, Server, Lock, Image, Gauge, FileSpreadsheet, Code2,
    Network, Minimize2, ArrowRight, BookOpen, Rocket, ChevronRight,
    Boxes, BarChart3, Wrench, Users, Star, GitBranch,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────

const authors = [
    { githubUsername: 'absya23' },
    { githubUsername: 'trangSikido' },
    { githubUsername: 'triplet511' },
    { githubUsername: 'phduong65' },
    { githubUsername: 'TrungDucVoz' },
];

const stats = [
    { number: '33+', label: 'Plugins', Icon: Puzzle },
    { number: 'v8.0', label: 'Latest version', Icon: Star },
    { number: '70+', label: 'Field types', Icon: Layers },
    { number: 'PHP 8', label: 'Platform', Icon: Cpu },
];

const uspCards = [
    { Icon: Puzzle, color: '#ff2d20', title: 'Plugin Architecture', desc: 'Mỗi plugin hoàn toàn tự chứa — tự khai báo qua plugin.json, PSR-4 namespace, middleware riêng. Bật/tắt không ảnh hưởng đến core.' },
    { Icon: Webhook, color: '#a855f7', title: 'Hook System', desc: 'do_action / apply_filters cho phép can thiệp vào mọi điểm xử lý mà không sửa code core — đúng kiểu WordPress nhưng mạnh hơn.' },
    { Icon: ShoppingCart, color: '#f97316', title: 'E-commerce Built-in', desc: 'Plugin sicommerce v4.5.3 tích hợp sâu: sản phẩm, biến thể, giỏ hàng, đơn hàng, cổng thanh toán — toàn bộ hook-driven.' },
    { Icon: MapPin, color: '#0ea5e9', title: 'Thị trường Việt Nam', desc: 'Cổng thanh toán Alepay, phí vận chuyển theo quận/huyện, đăng nhập bằng số điện thoại, đa ngôn ngữ VI/EN.' },
    { Icon: PaintbrushVertical, color: '#10b981', title: 'Visual Page Builder', desc: 'Element Builder + Widget System + ThemeOption Builder thiết kế giao diện trực quan từ Admin, hơn 70+ field types.' },
    { Icon: Zap, color: '#f59e0b', title: 'Custom PHP Framework', desc: 'Không dùng Laravel full-stack. Xây dựng SkillDo\\Application riêng, kế thừa có chọn lọc Illuminate v12.' },
];

const features = [
    { Icon: Package, color: '#ff2d20', title: 'skilldo/framework', desc: 'IoC Container, Routing, Cache, Eloquent ORM, Session, Auth, JWT API, BladeOne View, Translation, Pipeline.' },
    { Icon: Layers, color: '#a855f7', title: 'skilldo/cms', desc: 'Plugin Loader, Hook System, Widget Manager, Element Builder, Form Builder, Template Engine, Menu, Roles & RBAC.' },
    { Icon: ShieldCheck, color: '#10b981', title: 'Bảo mật toàn diện', desc: 'Security Headers, HTML Purifier (XSS), CORS, CSRF, JWT, Request Sanitizer, UUID, System Status lock.' },
    { Icon: Gauge, color: '#f97316', title: 'Multi-layer Cache', desc: 'Widget Cache, Plugin Manifest Cache, Route Cache, Model Query Cache — File / Redis / Memcached.' },
    { Icon: Globe, color: '#0ea5e9', title: 'REST API Ready', desc: 'JWT Authentication + API Key middleware. Stateless API layer sẵn sàng cho horizontal scaling.' },
    { Icon: Terminal, color: '#f59e0b', title: 'DevTool CLI', desc: 'Console commands artisan-like, scaffold plugin/theme, manage cache, chạy scheduler — tất cả trong terminal.' },
];

const techStack = [
    { Icon: Cpu, name: 'PHP 8.x', color: '#7c3aed' },
    { Icon: Database, name: 'MySQL + Doctrine DBAL v4', color: '#0ea5e9' },
    { Icon: Package, name: 'Illuminate Components v12', color: '#f97316' },
    { Icon: Code2, name: 'BladeOne v4 Template', color: '#10b981' },
    { Icon: Lock, name: 'firebase/php-jwt v7', color: '#f59e0b' },
    { Icon: Image, name: 'intervention/image v3', color: '#ec4899' },
    { Icon: Server, name: 'Redis / Memcached', color: '#ff2d20' },
    { Icon: FileSpreadsheet, name: 'phpoffice/phpspreadsheet', color: '#3b82f6' },
    { Icon: Code2, name: 'wikimedia/less.php', color: '#84cc16' },
    { Icon: Network, name: 'Guzzle + Symfony HTTP', color: '#8b5cf6' },
    { Icon: Minimize2, name: 'matthiasmullie/minify', color: '#06b6d4' },
    { Icon: Globe, name: 'fruitcake/php-cors', color: '#14b8a6' },
];

const pluginCategories = [
    {
        Icon: ShoppingCart, title: 'E-Commerce', color: '#f97316',
        plugins: [
            { name: 'sicommerce', desc: 'Core e-commerce engine' },
            { name: 'discounts', desc: 'Mã giảm giá & khuyến mãi' },
            { name: 'shipping', desc: 'Phí vận chuyển động' },
            { name: 'payment-alepay', desc: 'Cổng thanh toán Alepay' },
            { name: 'stock-manager', desc: 'Quản lý tồn kho' },
            { name: 'branch-management', desc: 'Quản lý chi nhánh' },
            { name: 'badge-management', desc: 'Nhãn sản phẩm' },
            { name: 'products-filters', desc: 'Bộ lọc nâng cao' },
        ],
    },
    {
        Icon: BarChart3, title: 'Marketing', color: '#ec4899',
        plugins: [
            { name: 'skd-seo', desc: 'SEO & Sitemap tự động' },
            { name: 'skd-statistics', desc: 'Analytics & báo cáo' },
            { name: 'popup', desc: 'Pop-up marketing' },
            { name: 'social-contact-button', desc: 'Nút liên hệ nổi' },
            { name: 'fake-notification', desc: 'Social proof notification' },
            { name: 'affiliate', desc: 'Hệ thống cộng tác viên' },
            { name: 'feedback', desc: 'Thu thập phản hồi' },
            { name: 'ai-content', desc: 'AI tạo nội dung' },
        ],
    },
    {
        Icon: Wrench, title: 'Hệ thống & Dev', color: '#3b82f6',
        plugins: [
            { name: 'DevTool', desc: 'CLI & Console commands' },
            { name: 'user-role-editor', desc: 'Phân quyền RBAC' },
            { name: 'skd-multi-language', desc: 'Đa ngôn ngữ' },
            { name: 'page-builder', desc: 'Visual page builder' },
            { name: 'slider', desc: 'Banner & Slider' },
            { name: 'schedule-calendar', desc: 'Lịch & nhắc nhở' },
            { name: 'duplicate', desc: 'Nhân bản nội dung' },
            { name: 'watermark', desc: 'Watermark ảnh tự động' },
        ],
    },
];

const archSteps = [
    { label: 'index.php', Icon: Globe, color: '#6b7a9e', sub: [] },
    { label: 'bootstrap/app.php', Icon: Server, color: '#0ea5e9', sub: [] },
    { label: 'Application::configure()', Icon: Cpu, color: '#a855f7', sub: ['web.php', 'admin.php', 'api.php'] },
    { label: 'Cms\\Loader::boot()', Icon: Webhook, color: '#ff2d20', sub: ['cms_loaded', 'plugins_loaded', 'after_setup_theme'] },
];

// ── Animated counter hook ──────────────────────────────────────────────────

function useCountUp(target, duration = 1200) {
    const [count, setCount] = useState(0);
    const triggered = useRef(false);
    const nodeRef = useRef(null);
    useEffect(() => {
        const num = parseInt(target);
        if (isNaN(num)) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !triggered.current) {
                triggered.current = true;
                const start = performance.now();
                const tick = (now) => {
                    const p = Math.min((now - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    setCount(Math.floor(ease * num));
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.5 });
        if (nodeRef.current) observer.observe(nodeRef.current);
        return () => observer.disconnect();
    }, [target, duration]);
    return { count, nodeRef };
}

// ── Reveal on scroll ───────────────────────────────────────────────────────

function useReveal(delay = 0) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);
    return { ref, visible };
}

// ── Stat Item ─────────────────────────────────────────────────────────────

function StatItem({ number, label, Icon }) {
    const numPart = number.replace(/[^0-9]/g, '');
    const suffix = number.replace(/[0-9]/g, '');
    const { count, nodeRef } = useCountUp(numPart);
    return (
        <div ref={nodeRef} className={styles.statItem}>
            <div className={styles.statIconWrap}><Icon size={20} strokeWidth={1.5} /></div>
            <span className={styles.statNumber}>{numPart ? count + suffix : number}</span>
            <span className={styles.statLabel}>{label}</span>
        </div>
    );
}

// ── Hero ──────────────────────────────────────────────────────────────────

function HeroBanner() {
    return (
        <header className={styles.heroBanner}>
            <div className={styles.heroBg}>
                <div className={styles.gridLines} />
                <div className={styles.glowOrb1} />
                <div className={styles.glowOrb2} />
                <div className={styles.glowOrb3} />
                <div className={styles.particles}>
                    {[...Array(18)].map((_, i) => (
                        <span key={i} className={styles.particle} style={{
                            '--x': `${5 + (i * 37 + 13) % 90}%`,
                            '--y': `${5 + (i * 53 + 7) % 90}%`,
                            '--d': `${4 + (i % 4) * 2}s`,
                            '--delay': `${(i * 0.35) % 5}s`,
                            '--size': `${2 + (i % 3)}px`,
                        }} />
                    ))}
                </div>
            </div>

            <div className="container">
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <span className={styles.heroBadgeDot} />
                        <span>SkillDo CMS</span>
                        <span className={styles.heroBadgeVersion}>v8.0.0</span>
                        <span>by SKDSoftware</span>
                    </div>

                    <Heading as="h1" className={styles.heroTitle}>
                        Hệ thống CMS<br />
                        <span className={styles.heroTitleAccent}>thương mại điện tử</span><br />
                    </Heading>

                    <p className={styles.heroSubtitle}>
                        Nền tảng PHP thuần, kiến trúc <strong>plugin-first</strong>, hook system mạnh mẽ.
                        Xây dựng website chuyên nghiệp với đầy đủ tính năng E-commerce, SEO, và Analytics.
                    </p>

                    <div className={styles.heroActions}>
                        <Link to="/8.0.0/doc/Prologue/Overview" className={styles.btnPrimary}>
                            <BookOpen size={18} strokeWidth={2} />
                            Đọc tài liệu
                            <span className={styles.btnGlow} />
                        </Link>
                        <Link to="/8.0.0/doc/Prologue/Overview" className={styles.btnSecondary}>
                            <Rocket size={18} strokeWidth={2} />
                            Bắt đầu ngay
                            <ArrowRight size={16} strokeWidth={2} />
                        </Link>
                    </div>

                    <div className={styles.heroCodePreview}>
                        <div className={styles.codeBar}>
                            <span className={styles.codeDot} style={{ background: '#ff5f57' }} />
                            <span className={styles.codeDot} style={{ background: '#ffbd2e' }} />
                            <span className={styles.codeDot} style={{ background: '#28c840' }} />
                            <span className={styles.codeFileName}>plugin.json</span>
                        </div>
                        <pre className={styles.codeContent}>{`{
  "name": "my-plugin",
  "namespace": "MyPlugin",
  "hooks": {
    "cms_loaded": "MyPlugin\\\\Bootstrap::init"
  }
}`}</pre>
                    </div>
                </div>

                <div className={styles.heroStats}>
                    {stats.map((s, i) => <StatItem key={i} {...s} />)}
                </div>
            </div>
        </header>
    );
}

// ── USP ───────────────────────────────────────────────────────────────────

function UspSection() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTag}><GitBranch size={12} strokeWidth={2} />Điểm khác biệt</div>
                    <Heading as="h2" className={styles.sectionTitle}>Tại sao chọn SkillDo CMS?</Heading>
                    <p className={styles.sectionSubtitle}>Không phải WordPress, không phải Laravel. Một framework hoàn toàn tự xây dựng, tối ưu cho hiệu suất và khả năng mở rộng.</p>
                </div>
                <div className={styles.uspGrid}>
                    {uspCards.map(({ Icon, color, title, desc }, i) => {
                        const { ref, visible } = useReveal(i * 80);
                        return (
                            <div key={i} ref={ref} className={`${styles.uspCard} ${visible ? styles.revealed : ''}`} style={{ '--accent': color }}>
                                <div className={styles.uspIconWrap}><Icon size={22} strokeWidth={1.75} color={color} /></div>
                                <div>
                                    <div className={styles.uspTitle}>{title}</div>
                                    <div className={styles.uspDesc}>{desc}</div>
                                </div>
                                <div className={styles.uspCardGlow} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ── Features ──────────────────────────────────────────────────────────────

function FeaturesSection() {
    return (
        <section className={styles.sectionAlt}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTag}><Boxes size={12} strokeWidth={2} />Tính năng cốt lõi</div>
                    <Heading as="h2" className={styles.sectionTitle}>Mọi thứ bạn cần, sẵn trong core</Heading>
                    <p className={styles.sectionSubtitle}>Hai internal packages tách biệt rõ ràng, mỗi tầng đảm nhiệm một vai trò cụ thể.</p>
                </div>
                <div className={styles.featuresGrid}>
                    {features.map(({ Icon, color, title, desc }, i) => {
                        const { ref, visible } = useReveal(i * 60);
                        return (
                            <div key={i} ref={ref} className={`${styles.featureCard} ${visible ? styles.revealed : ''}`} style={{ '--accent': color }}>
                                <div className={styles.featureIconWrap}><Icon size={24} strokeWidth={1.5} color={color} /></div>
                                <div className={styles.featureTitle}>{title}</div>
                                <div className={styles.featureDesc}>{desc}</div>
                                <div className={styles.featureCardLine} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ── Arch ──────────────────────────────────────────────────────────────────

function ArchSection() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTag}><Network size={12} strokeWidth={2} />Kiến trúc</div>
                    <Heading as="h2" className={styles.sectionTitle}>Boot Flow & Hook System</Heading>
                    <p className={styles.sectionSubtitle}>Quá trình khởi động rõ ràng, mỗi bước là một điểm hook có thể can thiệp.</p>
                </div>
                <div className={styles.archFlow}>
                    {archSteps.map(({ label, Icon, color, sub }, i) => (
                        <React.Fragment key={i}>
                            <div className={styles.archStep}>
                                <div className={styles.archBox} style={{ '--accent': color }}>
                                    <span className={styles.archBoxIcon}><Icon size={16} strokeWidth={1.75} color={color} /></span>
                                    <code>{label}</code>
                                </div>
                                {sub.length > 0 && (
                                    <div className={styles.archSubItems}>
                                        {sub.map((s, j) => <span key={j} className={styles.archSubItem} style={{ '--accent': color }}>{s}</span>)}
                                    </div>
                                )}
                            </div>
                            {i < archSteps.length - 1 && (
                                <div className={styles.archConnector}>
                                    <div className={styles.archLine} />
                                    <ChevronRight size={18} className={styles.archArrowIcon} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Tech Stack ────────────────────────────────────────────────────────────

function TechStackSection() {
    return (
        <section className={styles.sectionAlt}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTag}><Code2 size={12} strokeWidth={2} />Tech Stack</div>
                    <Heading as="h2" className={styles.sectionTitle}>Công nghệ & Thư viện</Heading>
                    <p className={styles.sectionSubtitle}>Xây dựng trên nền tảng các thư viện PHP chất lượng cao, battle-tested.</p>
                </div>
                <div className={styles.techGrid}>
                    {techStack.map(({ Icon, name, color }, i) => {
                        const { ref, visible } = useReveal(i * 40);
                        return (
                            <div key={i} ref={ref} className={`${styles.techItem} ${visible ? styles.revealed : ''}`} style={{ '--accent': color }}>
                                <div className={styles.techIconWrap}><Icon size={18} strokeWidth={1.75} color={color} /></div>
                                <span>{name}</span>
                                <div className={styles.techItemGlow} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ── Plugins ───────────────────────────────────────────────────────────────

function PluginsSection() {
    const [activeTab, setActiveTab] = useState(0);
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTag}><Puzzle size={12} strokeWidth={2} />Plugins</div>
                    <Heading as="h2" className={styles.sectionTitle}>33 Plugins sẵn có</Heading>
                    <p className={styles.sectionSubtitle}>Bao phủ toàn bộ nhu cầu từ E-commerce đến Marketing, Analytics và DevOps.</p>
                </div>
                <div className={styles.pluginTabs}>
                    {pluginCategories.map(({ Icon, title, color }, i) => (
                        <button key={i} onClick={() => setActiveTab(i)} className={`${styles.pluginTab} ${activeTab === i ? styles.pluginTabActive : ''}`} style={{ '--accent': color }}>
                            <Icon size={16} strokeWidth={1.75} />
                            {title}
                        </button>
                    ))}
                </div>
                <div className={styles.pluginGrid}>
                    {pluginCategories[activeTab].plugins.map(({ name, desc }, i) => (
                        <div key={`${activeTab}-${i}`} className={styles.pluginCard} style={{ '--accent': pluginCategories[activeTab].color, '--delay': `${i * 30}ms` }}>
                            <div className={styles.pluginCardDot} style={{ background: pluginCategories[activeTab].color }} />
                            <div>
                                <div className={styles.pluginName}>{name}</div>
                                <div className={styles.pluginDesc}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── CTA ───────────────────────────────────────────────────────────────────

function CtaSection() {
    return (
        <section className={styles.ctaSection}>
            <div className={styles.ctaBg}>
                <div className={styles.ctaGlow1} /><div className={styles.ctaGlow2} />
            </div>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className={styles.ctaBadge}><Rocket size={14} strokeWidth={2} />Bắt đầu ngay hôm nay</div>
                <Heading as="h2" className={styles.ctaTitle}>
                    Sẵn sàng xây dựng<br />
                    <span className={styles.heroTitleAccent}>dự án tiếp theo?</span>
                </Heading>
                <p className={styles.ctaSubtitle}>Đọc tài liệu đầy đủ để hiểu cách cài đặt, cấu hình và mở rộng hệ thống.</p>
                <div className={styles.ctaActions}>
                    <Link to="/8.0.0/doc/Prologue/Overview" className={styles.btnPrimary}>
                        <BookOpen size={18} strokeWidth={2} />Tổng quan hệ thống<span className={styles.btnGlow} />
                    </Link>
                    <Link to="/8.0.0/doc/Prologue/Overview" className={styles.btnSecondary}>
                        <Rocket size={18} strokeWidth={2} />Hướng dẫn bắt đầu<ArrowRight size={16} strokeWidth={2} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ── Authors ───────────────────────────────────────────────────────────────

function AuthorsSection() {
    return (
        <section className={styles.authorsSection}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionTag}><Users size={12} strokeWidth={2} />Đội ngũ</div>
                    <Heading as="h2" className={styles.sectionTitle}>Người đóng góp</Heading>
                </div>
                <div className={styles.authorsGrid}>
                    {authors.map((a, i) => <AuthorCard key={i} githubUsername={a.githubUsername} />)}
                </div>
            </div>
        </section>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
    return (
        <Layout
            title="SkillDo CMS — Hệ thống CMS thương mại điện tử cho thị trường Việt Nam"
            description="SkillDo CMS v8 — Custom PHP Framework, Plugin Architecture, Hook System, E-commerce built-in.">
            <HeroBanner />
            <main>
                <UspSection />
                <FeaturesSection />
                <ArchSection />
                <TechStackSection />
                <PluginsSection />
                <CtaSection />
                <AuthorsSection />
            </main>
        </Layout>
    );
}
