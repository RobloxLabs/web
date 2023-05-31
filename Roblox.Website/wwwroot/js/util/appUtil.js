export function getUrlUserId() {
    const reg = /\/users\/(\d+)\//g;
    const match = reg.exec(window.location.href);
    return match ? match[1] : null;
}