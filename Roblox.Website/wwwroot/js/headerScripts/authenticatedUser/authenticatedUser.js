const getUserDataset = (): DOMStringMap => {
    const metaTag = document.querySelector<HTMLMetaElement>('meta[name="user-data"]');
    return metaTag?.dataset ?? null;
};

const isAuthenticated = (): boolean => {
    return !!getUserDataset();
};

const isUnder13 = (): boolean => {
    return getUserDataset()?.isunder13 === 'true';
};

const getName = (): string | null => {
    return getUserDataset()?.name ?? null;
};

const getUserId = (): number => {
    if (getUserDataset()?.userid) {
        return Number.parseInt(getUserDataset()?.userid, 10);
    }
    return -1;
};

const isPremiumUser = (): boolean => {
    return getUserDataset()?.ispremiumuser === 'true';
};

const getCreatedDateTime = (): string | null => {
    return getUserDataset()?.created ?? null;
};

const getDisplayName = (): string | null => {
    return getUserDataset()?.displayname ?? null;
};

export default {
    isAuthenticated: isAuthenticated(),
    isUnder13: isUnder13(),
    name: getName(),
    id: getUserId(),
    isPremiumUser: isPremiumUser(),
    created: getCreatedDateTime(),
    displayName: getDisplayName()
};
