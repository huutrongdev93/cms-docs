import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const AuthorCard = ({ githubUsername }) => {
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        // Gọi GitHub API để lấy thông tin người dùng
        fetch(`https://api.github.com/users/${githubUsername}`)
            .then((response) => response.json())
            .then((data) => {
                setAuthor({
                    name: data.name || data.login, // Nếu không có tên, sử dụng login
                    avatar: data.avatar_url,
                    profileUrl: data.html_url,
                });
            })
            .catch((error) => console.error('Error fetching GitHub user data:', error));
    }, [githubUsername]);

    if (!author) {
        return <div>Loading...</div>;
    }

    return (
        <div className={clsx(styles.author)}>
            <img
                src={author.avatar}
                alt={author.name}
                style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }}
            />
            <div>
                <h3 className={clsx(styles.authorName)}>{author.name}</h3>
                <a href={author.profileUrl} target="_blank" rel="noopener noreferrer">
                    Visit GitHub Profile
                </a>
            </div>
        </div>
    );
};

export default AuthorCard;