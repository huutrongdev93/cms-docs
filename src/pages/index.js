import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import AuthorCard from "../components/AuthorCard/AuthorCard";

const authors = [
    {
        githubUsername: 'absya23', // Châu Thạch
    },
    {
        githubUsername: 'trangSikido', // Trang
    },
    {
        githubUsername: 'triplet511', // Tâm
    },
    {
        githubUsername: 'phduong65', // Phạm dương
    },
];

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className={clsx(styles.lightning)}></div>
            <div className={clsx(styles.source)}><img src="https://fullcalendar.io/static/octocat-3426eb21d8a4773c064f08dee9d6e043.png" alt=""/></div>
            
            <div className="container">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' ,gap: '10px'}}>
                    <div>
                        <p className={clsx(styles.colorTheme)} style={{
                            textAlign: 'left',
                            fontSize: '40px',
                            fontWeight: 'bold'
                        }}>Documentation</p>
                        <p style={{textAlign: 'left', color: '#dfdfd6', fontSize: '40px', fontWeight: 'bold'}}>For
                            developers which
                            based on Skilldo</p>
                        <p style={{textAlign: 'left', color: '#98989f', fontSize: '20px', fontWeight: 'bold'}}>Every
                            projects done very fast with high quality using our CMS.</p>
                        <div className={styles.buttons}></div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <HomepageHeader/>
            <main>
                <HomepageFeatures/>
                <div className="container">
                    <p className={clsx(styles.colorTheme)} style={{
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginTop: '50px'
                    }}>Đóng góp vào dự án</p>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px'}}>
                        {authors.map((author, index) => (
                            <AuthorCard key={index} githubUsername={author.githubUsername}/>
                        ))}
                    </div>
                </div>
            </main>
        </Layout>
    );
}
