import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' ,gap: '10px'}}>
                    <div>
                        <p style={{
                            textAlign: 'left',
                            color: '#ffa8a8',
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
                    <img src="/img/logo-skilldo.png" alt="My Site Logo" width="250px"/>
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
            </main>
        </Layout>
    );
}
