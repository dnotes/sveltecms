import * as components from './components';
import { adminPages } from 'sveltecms/core/AdminPage';
export default {
    components: Object.entries(components).map(([id, component]) => ({ id, component, admin: true })),
    adminPages,
};
