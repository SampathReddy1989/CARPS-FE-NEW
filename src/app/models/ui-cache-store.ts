export class UiCacheStore {

    public static toCache(key: string, obj: any) {
        let map: Map<string, any> = this.getCacheStore();
        map.set(key, obj);
        this.setCacheStore(map);
    }

    public static fromCache(key: string): any {
        let map: Map<string, any> = this.getCacheStore();
        if (map.has(key)) {
            return map.get(key);
        }
        return;
    }

    public static purgeCache() {
        localStorage.removeItem('UiCacheStoreMap');
        localStorage.clear();
    }

    private static getCacheStore(): Map<string, any> {
        if (localStorage.getItem('UiCacheStoreMap') === null) {
            return new Map();
        }
        let mapper: Map<string, any> = new Map(JSON.parse(localStorage.getItem('UiCacheStoreMap')));
        return mapper;
    }

    private static setCacheStore(map: Map<string, any>) {
        localStorage.setItem('UiCacheStoreMap', JSON.stringify(Array.from(map.entries())));
    }

}