# Common Goods — Small E-commerce Management

A Laravel 12 + React 19 application for a marketplace of independent shops. Administrators manage shops, owners, and a shared product catalog. Owners select shared products and customize their own shop listings. Customers browse only products actually listed in active shops.

[Storefront screenshot](docs/screenshots/storefront.png) · [Admin workspace screenshot](docs/screenshots/dashboard.png)

## Requirements

- PHP 8.2+ with Composer 2, and Laravel's standard extensions including `pdo_sqlite` (or `pdo_mysql`), `fileinfo`, `mbstring`, `openssl`, `dom`, `xml`, and `curl`.
- Node.js 20.19+ or 22.12+ and npm.
- SQLite (the default, no separate database service required), or MySQL 8+/MariaDB 10.4+.
- Internet access to install dependencies. Seed images use Unsplash; fonts use Google Fonts. Product cards have a local placeholder if an image is unavailable.

## Fresh setup

Clone this public repository and open a terminal in its root directory:

```sh
git clone https://github.com/Shawon005/small-ecommerce-management.git
cd small-ecommerce-management
```

1. Install the Laravel dependencies and copy the configuration:

   ```sh
   cd Laravel
   composer install
   php -r "file_exists('.env') || copy('.env.example', '.env');"
   php artisan key:generate
   php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
   php artisan migrate --seed
   php artisan storage:link
   ```

   The example configuration uses SQLite with database-backed sessions and cache. All required tables are included in migrations. The seed command can be run again without duplicating demo records or resetting existing passwords.

2. Build the React frontend:

   ```sh
   cd ../React
   npm ci
   npm run build
   ```

   Vite writes the frontend assets and manifest to `Laravel/public/build`. No separate frontend server or CORS configuration is needed for this mode.

3. Start the application:

   ```sh
   cd ../Laravel
   php artisan serve --host=127.0.0.1 --port=8000
   ```

4. Open **http://127.0.0.1:8000**. Use **Shop owner sign in** to access the workspace. Both administrators and owners use the same login form; permissions and navigation depend on the account role.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@example.com` | `password` |
| Owner of The Home Edit and Field & Form | `owner@example.com` | `password` |
| Owner of Slow Studio | `sam@example.com` | `password` |

These credentials are for local assessment only. Do not seed demo accounts in a public production deployment.

### MySQL / MariaDB option

Before running migrations, create a dedicated database:

```sql
CREATE DATABASE common_goods CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Replace the database section in `Laravel/.env` with:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=common_goods
DB_USERNAME=root
DB_PASSWORD=your_database_password
```

Then run `php artisan config:clear` and `php artisan migrate --seed` from `Laravel`. XAMPP users can use their local MySQL username/password and must start MySQL first. Apache's document root must point to `Laravel/public`, never the repository root. The `artisan serve` instructions work with XAMPP PHP and avoid virtual-host setup.

### Frontend development

Keep Laravel running on `http://127.0.0.1:8000`. In a second terminal:

```sh
cd React
npm run dev
```

Continue opening the application at port **8000**. Vite provides hot reload through Laravel's hot-file integration. Stop Vite and run `npm run build` before using production assets. If a forced shutdown leaves `Laravel/public/hot`, delete that file so Laravel uses the built manifest.

## Assessment walkthrough

1. Sign in as administrator. Create an owner under **Shop owners**, then create a shop under **Shops** and assign that owner. Shop name, slug, description, owner, and visibility can be edited.
2. Create a product in **Shared catalog**. Supply its name, unique SKU, category, default price, details, and optionally upload an image or enter an HTTP/HTTPS thumbnail URL. Uploads accept JPG, PNG, WebP, or GIF up to 2 MB and take priority over a URL. Both options include an image preview and are available when creating or editing catalog products and shop listings. New products are available to every signed-in owner immediately, but remain absent from the customer collection until listed.
3. Sign in as an owner. Browse **Shared catalog**, choose **Add to shop**, select one of your shops, and customize its name, details, price, image URL, and visibility. The same catalog product can be added to multiple shops, once per shop.
4. Use **Shop listings** to edit, hide, or remove a listing. These changes affect only that shop. Owners can also create products and edit their own catalog products; administrators can edit and delete any catalog product.
5. Open **View storefront**, filter by shop/category, search by product name, and open product details. Only active listings in active shops are returned. The seed catalog includes **Weekend Ceramic Vase** without a listing to demonstrate this rule, and a mug listed at **$24** in The Home Edit and **$26** in Slow Studio to demonstrate independent pricing.

## Data model and behavior

```text
users (admin | owner)
  ├── shops.owner_id
  └── products.created_by
shops ──< listings >── products
```

- `products` is the shared catalog. `listings` stores a separate copy of a shop's title, description, price, thumbnail, and active status. Updating catalog defaults does not overwrite existing listings.
- A unique database constraint on `(shop_id, product_id)` prevents duplicate assignments. Prices use fixed-point decimal columns, and validation rejects negative values and more than two decimal places.
- All management endpoints require authentication. Admin operations and shop ownership are checked on the server, including nested listing IDs; changing a URL cannot grant access to another owner's shop.
- Authentication uses Laravel sessions, hashed passwords, session rotation, CSRF protection, and login throttling. No tokens are stored in local storage. Account creation is admin-only and cannot assign the admin role through the owner endpoint.
- Deleting a listing preserves its catalog product. Deleting a shop removes its listings. Deleting a catalog product removes its listings from every shop after a confirmation in the UI. An owner with assigned shops cannot be deleted until the shops are reassigned or removed.
- Customer browsing is read-only. Checkout, orders, inventory quantities, and payment processing are outside the supplied assessment scope. Images support both file uploads and external URLs. Uploaded files are stored in `Laravel/storage/app/public/product-images` and served through `Laravel/public/storage`; run `php artisan storage:link` during setup and deployment. Keep uploaded images and the application's public URL available when moving between environments.

## Tests

Backend tests run against a separate, in-memory SQLite database and do not modify your configured database:

```sh
cd Laravel
php artisan test
vendor/bin/pint --test
```

On Windows, use `php vendor/bin/pint --test` if necessary. Tests cover authentication, authorization, shared catalog creation, independent overrides, visibility, filters, validation, duplicate assignments, deletion behavior, and repeatable seeding.

Browser tests exercise the built application, including real CSRF-protected login, admin CRUD, owner listing customization, customer browsing, and mobile layouts. Use a local database with demo records and no extra listings; the tests create and clean up their own records:

```sh
cd React
npm run build
npx playwright install chromium
npm test
```

Playwright starts Laravel on port 8000 automatically, or reuses an existing local server. Test screenshots and failure traces are ignored by Git. Do not run browser tests against production.

## Project layout

```text
Laravel/                  Laravel API and application entry point
  app/Models/             User, Shop, Product, Listing
  app/Http/Controllers/   Auth, management and public storefront behavior
  database/migrations/    Full relational schema and constraints
  database/seeders/       Repeatable demo data
  routes/marketplace.php  JSON endpoints with session and CSRF middleware
  resources/views/       React application shell
  tests/Feature/          Business rules and access-control tests
React/                    React interface, CSS, Vite, browser tests
.github/workflows/        Automated setup, backend and browser checks
```

Both dependency lockfiles are committed. `.env`, application keys, databases, vendor directories, node modules, and compiled assets are excluded.

## Deployment and repository submission

Run `composer install --no-dev --optimize-autoloader` in `Laravel`, `npm ci` and `npm run build` in `React`, configure a production `.env` with MySQL credentials and a generated key, run `php artisan migrate --force`, then `php artisan optimize`. Set `APP_ENV=production`, `APP_DEBUG=false`, a correct HTTPS `APP_URL`, and `SESSION_SECURE_COOKIE=true`. Give the web server write access to `Laravel/storage` and `Laravel/bootstrap/cache`; serve `Laravel/public`.

Public submission repository: **https://github.com/Shawon005/small-ecommerce-management**.

The repository includes the full source, migrations, demo seeders, configuration examples, dependency lockfiles, screenshots, automated tests, and a GitHub Actions workflow. Never commit `.env` or local credentials.
