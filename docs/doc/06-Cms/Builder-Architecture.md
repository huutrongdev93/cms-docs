# Page Builder — Bản đồ file & Kiến trúc

> Tài liệu tham chiếu để agent/dev chỉnh sửa Builder KHÔNG phải mò lại từng file. Đọc file này trước.
> Số dòng (`:NNN`) là mốc gần đúng, có thể lệch sau khi sửa — dùng để định vị, luôn xác nhận lại bằng grep.

## 1. Builder là gì

Page Builder (Element Builder) là trình dựng trang kéo-thả trong admin. Kiến trúc **2 runtime giao tiếp qua `postMessage`**:

- **Editor (trang cha)** — `element-builder.js`: sidebar element, cây DOM ẩn, cấu hình, undo/redo, autosave, publish.
- **Preview (iframe)** — `element-builder-review.js`: bản xem trước "thật", nhận message để vá DOM / cập nhật.

Nguồn dữ liệu duy nhất là **`BuilderDataStore`** (JS, `rows` tree). Khi publish, cây được ghi xuống DB và render ra site cho khách bằng các builder theme-side (`Theme{Header,Footer,Home,Page,Layout}`).

Có 5 loại section: `header`, `footer`, `home`, `page` (theo từng post/page/category), `layout` (layout tùy chỉnh, vd trang danh sách bài viết).

## 2. Lưu trữ (DB, 4 bảng — cột JSON)

| Model (`SkillDo\Cms\Models\`) | Bảng | Vai trò |
|---|---|---|
| `ElementBuilderSection` | `element_builder_sections` | **Bản chính**. 1 row / (`key`,`type`). Cột `setting` (global JSON) + `builder` (cây widget JSON) + `scope`. |
| `ElementBuilderDraft` | `element_builder_draft` | Autosave nháp, 1 row / `key_section`. |
| `ElementBuilderHistories` | `element_builder_histories` | Lịch sử publish (append, `version` tăng dần). Giữ tối đa 20 bản/section. |
| `ElementBuilderBlock` | `element_builder_blocks` | Block (row) tái sử dụng. |

## 3. Điểm vào (routes)

**Admin (`routes/admin.php:94-100`)** → `App\Controllers\Admin\BuilderController`:
- `GET /admin/theme/builder` → `index` (trang tổng builder, view `builder-index`)
- `GET /admin/theme/builder/{header,footer,home,page}` → mở editor (view `builder-page`)
- `GET /admin/theme/builder/create` → `create` (view `builder-create`)
- `GET /admin/theme/builder/layout/{id}` → `layout`

**Web preview (`routes/web.php:20-25`)** → `App\Controllers\Web\BuilderReviewController` (render iframe từ JSON base64 POST lên):
- `/review/{header,footer,home,page,block,layout}`

## 4. Backend PHP

### Engine — `packages/skilldo/cms/src/Element/`
| File | Vai trò | Hàm chính (mốc dòng) |
|---|---|---|
| `ElementBuilder.php` | **Engine trung tâm**: đọc/ghi section, render HTML, sinh CSS/asset. | `getSection` :45 (có memoize/`forgetSection` :87), `header/footer/home/page/layout` :20-40, `save`/`saveBuildContent`/`saveSetting` :92-110, `handleSectionData` :173 (sanitize khi save), `buildAssets` :721 (thu CSS/JS + column/responsive CSS — walker `widgetCss` :544), `builderColum` :855 (instantiate + `widget()` → HTML), `renderColumn` :943 (bọc wrapper `.elementor-widget`), `render` :1054, `rowColumnCss`/`columnCss` :273/:330, `sanitizeId/Class` :463/:473. |
| `ElementManager.php` | Registry element (singleton). Đọc `elements.json` (cache `theme_elements` 24h), lazy `new $class()`. | `getElement` (memoized), `getElements` (eager — dùng cho palette), `getIcon`, `getCategory` |
| `Element.php` | Base class abstract cho element. Selector CSS `.{key}_{id}`. | `cssSelector` :41 |
| `ElementPermission.php` | Phân quyền builder (role `builder` cần key kích hoạt, lưu `session('builder_permission')`). | `jsPermission`, `getTime`, `hasDownload` |

### Controllers — `app/Controllers/`
| File | Vai trò |
|---|---|
| `Admin/BuilderController.php` | Render khung editor (chỉ truyền metadata; cây do JS tải qua ajax). Methods: `index/header/footer/home/page/create/layout`. |
| `Web/BuilderReviewController.php` | Render preview trong iframe từ JSON base64 (`data` param). 1 method/scope. Mỗi lần duyệt cây 2 lần: `buildAssets(...,'review')` + `render(...,'review')`. |

### Ajax — `views/admin/app/Ajax/` (đăng ký ở `views/admin/bootstrap/ajax.php:85-113`)
**`BuilderAjax.php`** (21 action):
- Tải: `loadData` :158 (cây), `loadElement` :190 (palette), `loadDraft` :1075, `loadNavigatorLayouts` :1134
- Render mảnh: `renderWidget` :407 (1 widget → HTML+`<style>`+`classes`), `renderCss` :643, `render{Widget,Row,Nested,Column,Settings}Form`
- Ghi: `save` :730 (**publish**: handleSectionData → 1 UPDATE → `Theme*::build` → history + prune 20 → xóa draft), `saveDraft` :999 (autosave), `delete`, `deleteDraft`
- Block/Layout: `saveBlock`/`getBlocks`/`deleteBlock`, `createLayout`/`deleteLayout`/`setDefaultLayout`

**`BuilderServiceAjax.php`** (element store + key kích hoạt cho role `builder`): `load`/`categories`/`download`/`install`/`requestPermission`/`activePermission`/`deletePermission`.

### Render site cho khách — `views/theme-store/app/Builders/`
`Theme{Header,Footer,Home,Page,Layout}.php` — mỗi cái có `build()` (dựng bundle `assets/bundle/{scope}.min.css/js`), `assets()` (đăng ký, lazy build nếu file thiếu), `render()` (đọc section → `ElementBuilder::render` → HTML). Điểm vào: `packages/skilldo/cms/src/Support/ThemeLayoutView.php`.
> **CSS/JS live được cache ra file bundle; HTML KHÔNG cache** (dựng lại mỗi request). `getSection` memoize theo request.

## 5. Frontend JS

**Source ở `views/admin/assets/js/bundle/`** (KHÔNG phải file chạy). Xem `[[js-bundle-build-pipeline]]` — build bằng `cms:build:js` (DevTool terminal) → minify → obfuscator.io.

| Source | Chạy trong | Vai trò |
|---|---|---|
| `element-builder.js` (~3900 dòng) | **Editor (cha)** → gộp vào `script.bundle.js` | `window.BUILDER_ACTIONS` :37 (protocol), `BuilderHistoryManager` :88 (undo/redo 20 + autosave 10s), `SectionBuilder` :722 (1 section: sortable, drop, config, sync; `insertWidgetToPreview` = chèn widget mới), `ElementBuilderGlobal` :3923 (điều phối, message listener từ iframe :4098, nút header). |
| `builder-data-store.js` | Editor → `script.bundle.js` | `BuilderDataStore` — cây `rows`, `this.settings === window.WIDGET_SETTINGS` (dùng chung ref). Mutations: `addRow/addColumn/addWidget/addNestedRow/moveWidget/reorderWidgets/removeColumn/duplicate*`. |
| `element-builder-studio.js` | Editor → `script.bundle.js` | Modal element store (`ElementBuilderStudio`) + key kích hoạt. |
| `element-builder-navigator.js` | Editor | Modal chuyển đổi builder. |
| `element-builder-review.js` (~3900 dòng) | **Iframe preview** → build RIÊNG ra `element-builder-review.bundle.js` (KHÔNG qua `cms:build:js`) | Message listener :3600, các handler vá DOM, drag/resize/highlight, init widget. |

**File chạy thực tế (đã build):** `views/admin/assets/js/script.bundle.js` (obfuscate) + `element-builder-review.bundle.js`. Init: `builder-page.blade` gọi `ElementBuilderGlobal.init()`.

Widget init trong iframe: `packages/scripts/core/element.js` — `elementorFrontend.utils.reloadWidgetContent` :105 (thay nội dung wrapper + chạy script), `elementsHandler.runReadyTrigger` :36 (bắn hook `frontend/ready/{data-widget_type}`).

## 6. Protocol postMessage (`BUILDER_ACTIONS`, `element-builder.js:37`)

**Cha → Iframe (vá DOM, không reload):** `ADD_ROW`, `ADD_COLUMN`, `ADD_NESTED_ROW`, `INSERT_WIDGET` (chèn wrapper widget mới rỗng), `UPDATE_ELEMENT` (fill 1 widget qua `renderWidget`), `DELETE_ROW/COLUMN/ELEMENT`, `MOVE_WIDGET`, `REORDER_WIDGETS`, `UPDATE_LAYOUT` (CSS width), `UPDATE_STYLE` (CSS 1 element), `HOVER/SELECT/...`.

**Iframe → Cha:** `OPEN_CONFIG`, `IFRAME_DRAG_WIDGET`, `IFRAME_REORDER_ROWS`, `IFRAME_HOVER_ELEMENT`, `IFRAME_COLUMN_RESIZE`, `IFRAME_ADD_ROW/COLUMN`, `IFRAME_DROP_RESULT`, `IFRAME_DELETE/DUPLICATE/PASTE_ELEMENT`, ...

**DOM iframe:** row `.build-row#id` (`.build-content` bên trong) · column `.build-column#id` (`.is-empty` khi rỗng) · widget `.elementor-widget[data-id][data-widget_type="{type}.default"]` · nested `.inner-row-wrapper[data-id][data-type="layout_row"]`.

## 7. Luồng chính

- **Mở editor:** `BuilderController` → `builder-page.blade` → JS `loadData` (cây) + `loadElement` (palette) + `loadDraft`.
- **Sửa nội dung/style 1 widget:** form đổi (debounce 300ms) → store → `UPDATE_ELEMENT`/`UPDATE_STYLE` (vá, không reload).
- **Thao tác cấu trúc:** xem bảng mục 8 (đa số đã vá DOM; số ít còn `syncToPreview()` = reload iframe).
- **Publish (`save`):** sanitize → 1 UPDATE section → `Theme*::build()` (bundle CSS/JS) → ghi history (giữ 20) → xóa draft.
- **Preview reload:** `syncToPreview()` serialize cả cây → base64 → POST `/review/{scope}` → server render → iframe reload.

## 8. Vá DOM vs Reload — trạng thái hiện tại

| Thao tác | Cách | Hàm (element-builder.js) |
|---|---|---|
| Sửa nội dung/style widget | ✅ vá DOM | `syncWidget`, `_syncCssOnly` |
| Kéo-sắp xếp widget trong preview | ✅ vá DOM | `updateWidgetPositionFromIframe`, sortable receive/update |
| Thêm hàng / thêm cột | ✅ vá DOM | `addNewRow`, `addColumn` |
| Xóa hàng / cột / widget | ✅ vá DOM | `removeRow`, `removeCol`, `removeWidget` |
| Thêm nested row | ✅ vá DOM | `addNestedRowToColumn` |
| **Kéo/paste 1 widget mới** | ✅ vá DOM (fallback reload nếu loại element lần đầu) | `handleDropWidget`, `handleIframeDropResult`, `pasteWidget`, `pasteElement` → `insertWidgetToPreview` |
| Kéo/paste layout_row & nested (nhiều widget) | 🔒 reload | nhánh `layout_row`/`nested` |
| Drop vào container | 🔒 reload | `handleIframeDropResult` (isContainer) |
| Duplicate widget/row/column | 🔒 reload | `duplicateWidget`, `duplicateElementFromIframe` |
| Sắp xếp row/col trong panel | 🔒 reload | `initSortableRows/Columns` |
| Đổi field cấu hình cấu trúc | 🔒 reload (hợp lý) | `saveConfig` |

## 9. Gotchas & bất biến (BẮT BUỘC nhớ)

1. **Sửa JS builder phải build lại.** `element-builder.js`/`builder-data-store.js`/`studio` → `cms:build:js`. `element-builder-review.js` → build RIÊNG (không có trong `cms:build:js`). PHP/blade chạy ngay. Xem `[[js-bundle-build-pipeline]]`.
2. **Asset tĩnh element theo bundle section.** CSS/JS tĩnh của element (gồm handler `frontend/ready/{type}`) nằm trong bundle build LÚC iframe load. Kéo **loại element chưa từng có** → thiếu CSS/JS → phải reload để nạp. `insertWidgetToPreview` tự fallback. Xem `[[builder-preview-patch-architecture]]`.
3. **Store luôn là nguồn đúng** → publish/save luôn đúng dù preview lệch. Lệch preview khắc phục bằng reload/refresh.
4. **`this.settings === window.WIDGET_SETTINGS`** (cùng ref). `syncWidget` gửi `WIDGET_SETTINGS[id]`; đảm bảo store.addWidget đã chạy trước.
5. **Widget wrapper server** (`renderColumn:1034`): `<div class="elementor-widget build-element {type} {type}_{id} {config.class} {custom}" data-id data-widget_type="{type}.default">`. Wrapper vá-DOM phải khớp (INSERT_WIDGET đặt class cơ bản, `UPDATE_ELEMENT` bổ sung `config['class']` từ `renderWidget`).
6. **Element key == widget type** (selector CSS `.{key}_{id}`).
7. **`plugins/` và `storage/`** loại khỏi đọc code chung; `elements/` trong theme chứa element tải về.
8. **Preview `page`/`layout` render bằng LAYOUT THẬT của theme** (`$layout->layout()`), tức có cả header + footer thật — khác `header`/`footer`/`home` (chỉ render section trong `builder-review.blade`). Hệ quả:
   - `BuilderReviewController::assets()` gỡ `header-style`/`footer-style`/`header-script`/`footer-script`; scope nào render header/footer thật thì **phải gọi lại** `ThemeHeader::assets()` / `ThemeFooter::assets()`, không thì header/footer mất CSS-JS.
   - `ElementBuilder::render()` xuất `.build-row`/`.build-column`/`.elementor-widget` ở **mọi mode**, nên header/footer thật cũng mang các class đó. **Vùng builder = `.wrapper-review`** — trong `element-builder-review.js` chỉ được truy vấn qua `builderQuery`/`builderQueryAll` và lọc handler bằng `scopedClosest`/`isInBuilderScope`, tuyệt đối không `document.querySelectorAll('.build-*')`.

## 10. Tạo element mới
Xem `10-Theme Development/07-Theme-Elements.md` và skill `/element-builder`. Element = class extends `SkillDo\Cms\Element\Element`, implement `icon()/category()/form()/widget()`, optional `default()/cssBuilder()`, đăng ký trong `widget.json`.
