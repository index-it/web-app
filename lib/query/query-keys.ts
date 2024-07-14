
/// LISTS ///
const lists_qk = ['lists'];
const list_qk = (list_id: string) => lists_qk.concat(list_id);

/// CATEGORIES ///
const categories_qk = (list_id: string) => list_qk(list_id).concat('categories');
const category_qk = (list_id: string, category_id: string) => categories_qk(list_id).concat(category_id);

/// ITEMS ///
const items_qk = (list_id: string) => list_qk(list_id).concat('items');
const item_qk = (list_id: string, item_id: string) => items_qk(list_id).concat(item_id);

/// ITEM CONTENT ///
const item_content_qk = (list_id: string, item_id: string) => item_qk(list_id, item_id).concat('content');