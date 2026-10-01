module.exports = {
    apps: [
        {
            name: 'orisuun-nextjs-staging',
            script: 'npm',
            args: 'start',
            cwd: '/var/www/frontend-staging',
            instances: 1,
            exec_mode: 'fork',
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
                NODE_OPTIONS: '--max-old-space-size=512',
            },
            error_file: '/var/www/frontend-staging/logs/error.log',
            out_file: '/var/www/frontend-staging/logs/out.log',
            merge_logs: true,
            autorestart: true,
            watch: false,
            restart_delay: 3000,
            max_restarts: 5,
            restart_time: 60000,
        },
    ],
};
