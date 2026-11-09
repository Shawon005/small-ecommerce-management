import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  Store,
  Package,
  LayoutDashboard,
  Library,
  Users,
  Search,
  Plus,
  LogOut,
  X,
  Pencil,
  Trash2,
  Check,
  SlidersHorizontal,
  Leaf,
  ShoppingBag,
  Menu,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  LoaderCircle,
} from "lucide-react";
import { api, money } from "./api";
import "./style.css";

const categories = [
  "All products",
  "Home & Living",
  "Accessories",
  "Lifestyle",
  "Stationery",
];
const icons = {
  overview: LayoutDashboard,
  catalog: Library,
  listings: Package,
  shops: Store,
  owners: Users,
};
const labels = {
  overview: "Overview",
  catalog: "Shared catalog",
  listings: "Shop listings",
  shops: "Shops",
  owners: "Shop owners",
};

function ProductImage({ src, name, className = "" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? (
    <img
      className={className}
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className={`image-placeholder ${className}`}>
      <ShoppingBag size={40} strokeWidth={1} />
      <span>{name}</span>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState(
    location.pathname.startsWith("/manage") ? "manage" : "store",
  );
  const [section, setSection] = useState("overview");
  const [data, setData] = useState({
    products: [],
    shops: [],
    listings: [],
    owners: [],
  });
  const [store, setStore] = useState({
    shops: [],
    listings: { data: [], total: 0 },
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All products");
  const [shop, setShop] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [mobile, setMobile] = useState(false);
  const admin = user?.role === "admin";

  function navigate(target) {
    setScreen(target);
    setSearch("");
    setError("");
    history.pushState({}, "", target === "manage" ? "/manage" : "/");
  }
  useEffect(() => {
    const onBack = () =>
      setScreen(location.pathname.startsWith("/manage") ? "manage" : "store");
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, []);
  useEffect(() => {
    api("session")
      .then((s) => setUser(s.user))
      .catch((e) => setError(e.message))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    if (!ready) return;
    let active = true;
    setLoading(true);
    setError("");
    const timer = setTimeout(async () => {
      try {
        if (screen === "manage" && user) {
          const result = await api("dashboard");
          if (active) setData(result);
        } else {
          const params = new URLSearchParams({
            search,
            shop,
            page: String(page),
          });
          if (category !== "All products") params.set("category", category);
          const result = await api(`storefront?${params}`);
          if (active) setStore(result);
        }
      } catch (e) {
        if (active) {
          setError(e.message);
          if (e.status === 401) {
            setUser(null);
            setModal({ type: "login" });
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    ready,
    screen,
    user,
    reload,
    screen === "store" ? search : "",
    category,
    shop,
    page,
  ]);

  async function logout() {
    try {
      await api("logout", "POST");
      await api("session");
      setUser(null);
      navigate("store");
      setToast("You have been signed out.");
    } catch (e) {
      setError(e.message);
    }
  }
  const filtered = (items) =>
    items.filter((i) =>
      `${i.name} ${i.sku || ""} ${i.email || ""} ${i.shop?.name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  const title =
    screen === "manage"
      ? labels[section]
      : "The everyday, thoughtfully chosen.";
  const open = (type, item = {}) => setModal({ type, item });

  function listingFromProduct(product) {
    if (!data.shops.length) {
      setToast(
        "An administrator needs to assign a shop to your account first.",
      );
      return;
    }
    const available = data.shops.filter(
      (s) =>
        !data.listings.some(
          (l) => l.shop_id === s.id && l.product_id === product.id,
        ),
    );
    if (!available.length) {
      setToast("This product is already listed in all your shops.");
      return;
    }
    open("listing", {
      ...product,
      id: undefined,
      product_id: product.id,
      shop_id: available[0].id,
      is_active: true,
    });
  }

  const productCards = (items, catalog = false) => (
    <div className="product-grid">
      {items.map((item) => (
        <article className="product-card" key={item.id}>
          <button
            className="product-visual"
            onClick={() => open(catalog ? "catalogDetail" : "detail", item)}
            aria-label={`View ${item.name}`}
          >
            <ProductImage src={item.thumbnail} name={item.name} />
            <span className="image-category">
              {catalog ? item.category : item.product?.category}
            </span>
            <span className="image-action">
              <ArrowUpRight size={19} />
            </span>
          </button>
          <div className="product-meta">
            <span>
              {catalog
                ? item.creator?.name || "Shared catalog"
                : item.shop?.name}
            </span>
            {catalog && <span>{item.listings_count} shops</span>}
          </div>
          <div className="product-title">
            <button
              onClick={() => open(catalog ? "catalogDetail" : "detail", item)}
            >
              {item.name}
            </button>
            <strong>{money(item.price)}</strong>
          </div>
          <p className="product-description">{item.description}</p>
          {catalog && (
            <div className="card-actions">
              <button
                className="text-button"
                onClick={() => listingFromProduct(item)}
              >
                <Plus size={15} /> Add to shop
              </button>
              <div>
                {(admin || item.created_by === user?.id) && (
                  <button
                    className="icon-button"
                    title="Edit catalog product"
                    onClick={() => open("product", item)}
                  >
                    <Pencil size={15} />
                  </button>
                )}
                {admin && (
                  <button
                    className="icon-button danger"
                    title="Delete catalog product"
                    onClick={() =>
                      open("delete", {
                        ...item,
                        resource: "products",
                        warning:
                          "This also removes this product from every shop.",
                      })
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );

  if (!ready) return <Loading />;

  return (
    <div className={`app ${screen === "manage" && user ? "management" : ""}`}>
      {screen === "manage" && user ? (
        <>
          <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
            <a
              href="/"
              className="brand"
              onClick={(e) => {
                e.preventDefault();
                navigate("store");
              }}
            >
              <span className="brand-icon">
                <ShoppingBag size={21} />
              </span>
              common goods<span className="brand-dot">.</span>
            </a>
            <div className="workspace-label">
              YOUR WORKSPACE <span>{admin ? "ADMIN" : "OWNER"}</span>
            </div>
            <nav>
              {Object.keys(labels)
                .filter((k) => admin || !["shops", "owners"].includes(k))
                .map((k) => {
                  const Icon = icons[k];
                  return (
                    <button
                      key={k}
                      className={section === k ? "active" : ""}
                      onClick={() => {
                        setSection(k);
                        setSearch("");
                        setMobile(false);
                      }}
                    >
                      <Icon size={19} />
                      {labels[k]}
                      {k === "catalog" && (
                        <span className="nav-count">
                          {data.products.length}
                        </span>
                      )}
                    </button>
                  );
                })}
            </nav>
            <div className="sidebar-note">
              <Leaf size={25} />
              <h4>A little shop. A bigger world.</h4>
              <p>
                Good products deserve to be discovered. Grow together with a
                shared catalog.
              </p>
              <button onClick={() => navigate("store")}>
                Explore storefront <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="sidebar-bottom">
              <div className="avatar">{user.name.slice(0, 1)}</div>
              <div>
                <strong>{user.name}</strong>
                <small>{admin ? "Administrator" : "Shop owner"}</small>
              </div>
              <button className="icon-button" title="Sign out" onClick={logout}>
                <LogOut size={18} />
              </button>
            </div>
          </aside>
          <div className="manage-main">
            <header className="manage-header">
              <div>
                <button
                  className="icon-button mobile-menu"
                  onClick={() => setMobile(!mobile)}
                  aria-label="Toggle menu"
                >
                  <Menu size={21} />
                </button>
                <span className="breadcrumb">
                  Workspace <ChevronRight size={13} /> <b>{labels[section]}</b>
                </span>
              </div>
              <button
                className="subtle-button"
                onClick={() => navigate("store")}
              >
                <Globe size={16} /> View storefront <ArrowUpRight size={14} />
              </button>
            </header>
            <main className="manage-content">
              <div className="eyebrow">
                {admin ? "THE BIG PICTURE" : "YOUR SHOP, YOUR WAY"}
              </div>
              <div className="page-heading">
                <div>
                  <h1>
                    {section === "overview"
                      ? `Hello, ${user.name.split(" ")[0]}.`
                      : title}
                  </h1>
                  <p>
                    {
                      {
                        overview:
                          "A good day to grow something good. Here’s how your marketplace is looking.",
                        catalog:
                          "One shared collection. Endless possibilities for your shop.",
                        listings:
                          "Make each product your own. Set prices, details, and visibility.",
                        shops:
                          "A home for every collection. Manage your marketplace’s shops.",
                        owners:
                          "The people behind the shops. Manage accounts and access.",
                      }[section]
                    }
                  </p>
                </div>
                {section !== "overview" && (
                  <button
                    className="primary-button"
                    onClick={() =>
                      section === "listings"
                        ? (setSection("catalog"), setSearch(""))
                        : open(
                            {
                              catalog: "product",
                              shops: "shop",
                              owners: "owner",
                            }[section],
                          )
                    }
                  >
                    <Plus size={17} />
                    {section === "listings"
                      ? "Add from catalog"
                      : {
                          catalog: "Create product",
                          shops: "Create shop",
                          owners: "Add shop owner",
                        }[section]}
                  </button>
                )}
              </div>
              {error && (
                <div role="alert" className="error-banner">
                  {error}
                  <button onClick={() => setReload((r) => r + 1)}>Retry</button>
                </div>
              )}
              {loading ? (
                <Loading />
              ) : section === "overview" ? (
                <>
                  <div className="stats-grid">
                    {[
                      [
                        Library,
                        "Catalog products",
                        data.products.length,
                        "Available for every shop",
                      ],
                      [
                        Store,
                        admin ? "Total shops" : "Your shops",
                        data.shops.length,
                        `${data.shops.filter((s) => s.is_active).length} open for discovery`,
                      ],
                      [
                        Package,
                        "Shop listings",
                        data.listings.length,
                        `${data.listings.filter((l) => l.is_active).length} active listings`,
                      ],
                      [
                        admin ? Users : Eye,
                        admin ? "Shop owners" : "Unlisted products",
                        admin
                          ? data.owners.length
                          : data.products.filter(
                              (p) =>
                                !data.listings.some(
                                  (l) => l.product_id === p.id,
                                ),
                            ).length,
                        admin
                          ? "Independent people, shared growth"
                          : "Discover your next addition",
                      ],
                    ].map(([Icon, label, value, note]) => (
                      <div className="stat-card" key={label}>
                        <div>
                          <span>{label}</span>
                          <Icon size={19} />
                        </div>
                        <strong>{value.toString().padStart(2, "0")}</strong>
                        <small>
                          <span className="small-dot" />
                          {note}
                        </small>
                      </div>
                    ))}
                  </div>
                  <section className="overview-feature">
                    <div>
                      <span className="eyebrow">CURATED TO CONNECT</span>
                      <h2>
                        Your next bestseller
                        <br />
                        is already here.
                      </h2>
                      <p>
                        Discover products from across the community.
                        <br />
                        Add your touch, and give them a place in your shop.
                      </p>
                      <button
                        className="primary-button"
                        onClick={() => setSection("catalog")}
                      >
                        Explore shared catalog <ArrowUpRight size={17} />
                      </button>
                    </div>
                    <div className="feature-art">
                      <div className="art-circle" />
                      <ShoppingBag size={126} strokeWidth={0.8} />
                      <span className="art-note">
                        GOOD THINGS
                        <br />
                        GROW TOGETHER.
                      </span>
                      <Leaf className="art-leaf" size={60} strokeWidth={1} />
                    </div>
                  </section>
                  <div className="section-heading">
                    <div>
                      <h2>
                        Fresh in the catalog{" "}
                        <span className="count-pill">
                          {data.products.length}
                        </span>
                      </h2>
                      <p>A few good things to get you inspired.</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setSection("catalog")}
                    >
                      View all products <ArrowRight size={16} />
                    </button>
                  </div>
                  {data.products.length ? (
                    productCards(data.products.slice(0, 4), true)
                  ) : (
                    <Empty
                      text="Your shared catalog is ready for its first product."
                      action={() => open("product")}
                      label="Create product"
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="list-toolbar">
                    <div className="search-input">
                      <Search size={18} />
                      <input
                        aria-label="Search workspace"
                        placeholder={`Search ${labels[section].toLowerCase()}…`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      {search && (
                        <button
                          className="icon-button"
                          onClick={() => setSearch("")}
                          aria-label="Clear search"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <span className="result-count">
                      {
                        filtered(
                          data[
                            {
                              catalog: "products",
                              listings: "listings",
                              shops: "shops",
                              owners: "owners",
                            }[section]
                          ],
                        ).length
                      }{" "}
                      results
                    </span>
                  </div>
                  {section === "catalog" ? (
                    filtered(data.products).length ? (
                      productCards(filtered(data.products), true)
                    ) : (
                      <Empty text="No products found. Create one to start the collection." />
                    )
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            {{
                              shops: [
                                "Shop",
                                "Owner",
                                "Listings",
                                "Status",
                                "Actions",
                              ],
                              owners: [
                                "Owner",
                                "Email",
                                "Shops",
                                "Access",
                                "Actions",
                              ],
                              listings: [
                                "Product",
                                "Shop",
                                "Price",
                                "Status",
                                "Actions",
                              ],
                            }[section].map((h) => (
                              <th key={h}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered(data[section]).map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="table-identity">
                                  {section === "listings" ? (
                                    <ProductImage
                                      src={item.thumbnail}
                                      name={item.name}
                                    />
                                  ) : (
                                    <span className="table-avatar">
                                      {section === "shops" ? (
                                        <Store size={20} />
                                      ) : (
                                        item.name.slice(0, 1)
                                      )}
                                    </span>
                                  )}
                                  <div>
                                    <strong>{item.name}</strong>
                                    <small>
                                      {section === "shops"
                                        ? `/${item.slug}`
                                        : section === "listings"
                                          ? item.product?.sku
                                          : `Owner #${item.id}`}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {section === "shops"
                                  ? item.owner?.name
                                  : section === "owners"
                                    ? item.email
                                    : item.shop?.name}
                              </td>
                              <td>
                                {section === "listings"
                                  ? money(item.price)
                                  : section === "shops"
                                    ? item.listings_count
                                    : item.shops_count}
                              </td>
                              <td>
                                <span
                                  className={`status ${section === "owners" || item.is_active ? "" : "inactive"}`}
                                >
                                  <i />
                                  {section === "owners"
                                    ? "Shop owner"
                                    : item.is_active
                                      ? "Active"
                                      : "Hidden"}
                                </span>
                              </td>
                              <td>
                                <div className="row-actions">
                                  {section === "shops" && (
                                    <button
                                      className="icon-button"
                                      title="View shop"
                                      onClick={() => {
                                        setShop(item.slug);
                                        navigate("store");
                                      }}
                                    >
                                      <Eye size={16} />
                                    </button>
                                  )}
                                  <button
                                    className="icon-button"
                                    title="Edit"
                                    onClick={() =>
                                      open(
                                        {
                                          shops: "shop",
                                          owners: "owner",
                                          listings: "listing",
                                        }[section],
                                        item,
                                      )
                                    }
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    className="icon-button danger"
                                    title="Delete"
                                    onClick={() =>
                                      open("delete", {
                                        ...item,
                                        resource:
                                          section === "listings"
                                            ? `shops/${item.shop_id}/listings`
                                            : section,
                                        warning:
                                          section === "shops"
                                            ? "All listings in this shop will also be removed. Shared catalog products will remain."
                                            : section === "owners"
                                              ? "Reassign or delete their shops before removing this account."
                                              : "The shared catalog product will remain available.",
                                      })
                                    }
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {!filtered(data[section]).length && (
                        <Empty
                          text={`No ${labels[section].toLowerCase()} found.`}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
              <footer className="manage-footer">
                <span>Common Goods · Built for independent shops.</span>
                <span>
                  <span className="small-dot" /> Shared catalog, shared
                  possibilities
                </span>
              </footer>
            </main>
          </div>
        </>
      ) : (
        <>
          <div className="announcement">
            Small shops. Thoughtful finds. A little something for every day.{" "}
            <Leaf size={13} />
          </div>
          <header className="store-header">
            <a
              href="/"
              className="brand"
              onClick={(e) => {
                e.preventDefault();
                navigate("store");
              }}
            >
              <span className="brand-icon">
                <ShoppingBag size={21} />
              </span>
              common goods<span className="brand-dot">.</span>
            </a>
            <nav>
              <button
                className="store-nav-active"
                onClick={() =>
                  document
                    .getElementById("collection")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                The collection
              </button>
              <button
                onClick={() => document.getElementById("shop-filter")?.focus()}
              >
                Our shops
              </button>
            </nav>
            <button
              className="subtle-button"
              onClick={() =>
                user ? navigate("manage") : setModal({ type: "login" })
              }
            >
              {user ? "My workspace" : "Shop owner sign in"}{" "}
              <ArrowUpRight size={16} />
            </button>
          </header>
          <main className="store-main">
            <section className="store-hero">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="small-dot" /> INDEPENDENT SHOPS. SHARED
                  POSSIBILITIES.
                </span>
                <h1>
                  The everyday,
                  <br />
                  <em>thoughtfully chosen.</em>
                </h1>
                <p>
                  Discover good things from small shops.
                  <br />
                  Made for your home, your routine, and all the moments in
                  between.
                </p>
                <a className="primary-button" href="#collection">
                  Find your next favorite <ArrowDown />
                </a>
                <div className="hero-footnote">
                  <span className="mini-avatars">
                    <i>H</i>
                    <i>S</i>
                    <i>F</i>
                  </span>
                  <span>A growing community of independent shops</span>
                </div>
              </div>
              <div className="hero-collage">
                <div className="hero-photo">
                  <img
                    src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=850&q=85"
                    alt="Thoughtfully arranged plants and everyday objects in a warm home"
                  />
                  <div className="hero-photo-caption">
                    <span>LESS, BUT LOVELIER.</span>
                    <Leaf size={23} />
                  </div>
                </div>
                <div className="hero-sticker">
                  <Leaf size={23} strokeWidth={1.4} />
                  <span>
                    GOOD FINDS.
                    <br />
                    GOOD FEELING.
                  </span>
                </div>
                <div className="hero-bottom-tag">
                  <span className="small-dot" /> A little more considered. A
                  little more you.
                </div>
              </div>
            </section>
            <div className="values-bar">
              <span>
                <Store size={17} /> Independent shops
              </span>
              <span>
                <Leaf size={17} /> Thoughtfully selected
              </span>
              <span>
                <Package size={17} /> Everyday essentials
              </span>
              <span>
                <ShoppingBag size={17} /> One lovely collection
              </span>
            </div>
            <section id="collection" className="collection">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">THE GOOD STUFF</span>
                  <h2>
                    Find something that feels like you
                    <span className="brand-dot">.</span>
                  </h2>
                  <p>Little upgrades. Lasting favorites. All in one place.</p>
                </div>
                <span className="collection-count">
                  {store.listings.total || 0} thoughtful finds
                </span>
              </div>
              <div className="collection-toolbar">
                <div className="category-tabs">
                  {categories.map((c) => (
                    <button
                      key={c}
                      className={category === c ? "active" : ""}
                      onClick={() => {
                        setCategory(c);
                        setPage(1);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="shop-select">
                  <SlidersHorizontal size={15} />
                  <select
                    id="shop-filter"
                    aria-label="Filter by shop"
                    value={shop}
                    onChange={(e) => {
                      setShop(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All shops</option>
                    {store.shops.map((s) => (
                      <option key={s.id} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="store-search">
                <div className="search-input">
                  <Search size={17} />
                  <input
                    aria-label="Search products"
                    placeholder="Search the collection…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                {(search || shop || category !== "All products") && (
                  <button
                    className="text-button"
                    onClick={() => {
                      setSearch("");
                      setShop("");
                      setCategory("All products");
                      setPage(1);
                    }}
                  >
                    Clear filters <X size={14} />
                  </button>
                )}
              </div>
              {error ? (
                <div role="alert" className="error-banner">
                  {error}
                  <button onClick={() => setReload((r) => r + 1)}>Retry</button>
                </div>
              ) : loading ? (
                <Loading />
              ) : store.listings.data.length ? (
                productCards(store.listings.data)
              ) : (
                <Empty text="No finds here just yet. Try another shop or clear your filters." />
              )}
              {store.listings.last_page > 1 && (
                <div className="pagination">
                  <button
                    className="subtle-button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span>
                    Page {page} of {store.listings.last_page}
                  </span>
                  <button
                    className="subtle-button"
                    disabled={page === store.listings.last_page}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </section>
            <section className="community-banner">
              <div>
                <span className="eyebrow">BETTER, TOGETHER</span>
                <h2>
                  A small shop can make
                  <br />a big impression.
                </h2>
                <p>
                  One catalog connects a whole community.
                  <br />
                  Your shop brings it to life.
                </p>
              </div>
              <button
                className="primary-button"
                onClick={() =>
                  user ? navigate("manage") : setModal({ type: "login" })
                }
              >
                Step into your workspace <ArrowUpRight size={18} />
              </button>
              <Leaf className="community-leaf" size={120} strokeWidth={0.6} />
            </section>
          </main>
          <footer className="store-footer">
            <a className="brand" href="/">
              common goods<span className="brand-dot">.</span>
            </a>
            <span>Small shops. Shared possibilities.</span>
            <small>© {new Date().getFullYear()} Common Goods</small>
          </footer>
        </>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
          <button
            onClick={() => setToast("")}
            className="icon-button"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      )}
      {modal && (
        <Modal
          key={`${modal.type}-${modal.item?.id || "new"}`}
          modal={modal}
          close={() => setModal(null)}
          data={data}
          user={user}
          onLogin={async (person) => {
            await api("session");
            setUser(person);
            navigate("manage");
            setModal(null);
          }}
          onSaved={() => {
            setModal(null);
            setReload((r) => r + 1);
            setToast("Changes saved successfully.");
          }}
          onAdd={listingFromProduct}
        />
      )}
    </div>
  );
}

function ArrowDown() {
  return <ArrowRight size={17} style={{ transform: "rotate(90deg)" }} />;
}
function Loading() {
  return (
    <div className="loading" role="status">
      <LoaderCircle size={24} className="spin" />
      <span>Gathering the good things…</span>
    </div>
  );
}
function Empty({ text, action, label }) {
  return (
    <div className="empty-state">
      <Package size={35} strokeWidth={1} />
      <p>{text}</p>
      {action && (
        <button className="primary-button" onClick={action}>
          {label}
        </button>
      )}
    </div>
  );
}

function Modal({ modal, close, data, user, onLogin, onSaved, onAdd }) {
  const { type, item = {} } = modal;
  const initial =
    type === "login"
      ? { email: "", password: "" }
      : type === "owner"
        ? { name: item.name || "", email: item.email || "", password: "" }
        : type === "shop"
          ? {
              name: item.name || "",
              slug: item.slug || "",
              owner_id: item.owner_id || data.owners[0]?.id || "",
              description: item.description || "",
              is_active: item.is_active ?? true,
            }
          : {
              name: item.name || "",
              sku: item.sku || "",
              category: item.category || "Home & Living",
              description: item.description || "",
              price: item.price ?? "",
              thumbnail: item.thumbnail || "",
              product_id: item.product_id || "",
              shop_id: item.shop_id || data.shops[0]?.id || "",
              is_active: item.is_active ?? true,
            };
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handler = (e) => {
      if (e.key === "Escape" && !busy) close();
      if (e.key === "Tab") {
        const focusables = [
          ...ref.current.querySelectorAll(
            "button:not(:disabled), input, textarea, select, a[href]",
          ),
        ];
        const first = focusables[0],
          last = focusables.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, [busy]);
  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }));
  function field(key, label, inputType = "text", options = {}) {
    return (
      <label
        className={`form-field ${options.wide ? "full-width" : ""}`}
        key={key}
      >
        <span>{label}</span>
        {inputType === "textarea" ? (
          <textarea
            rows={3}
            value={values[key]}
            onChange={(e) => set(key, e.target.value)}
            required={options.required !== false}
            maxLength={5000}
          />
        ) : inputType === "select" ? (
          <select
            value={values[key]}
            onChange={(e) => set(key, e.target.value)}
            required
          >
            {options.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            value={values[key]}
            onChange={(e) => set(key, e.target.value)}
            required={options.required !== false}
            min={inputType === "number" ? "0" : undefined}
            step={inputType === "number" ? ".01" : undefined}
            minLength={key === "password" && type !== "login" ? 8 : undefined}
            maxLength={
              key === "thumbnail" ? 2048 : key === "password" ? 128 : 255
            }
            placeholder={options.placeholder}
            autoComplete={
              key === "password"
                ? type === "login"
                  ? "current-password"
                  : "new-password"
                : key === "email"
                  ? "email"
                  : undefined
            }
          />
        )}
        {errors[key] && <small className="field-error">{errors[key][0]}</small>}
      </label>
    );
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage("");
    try {
      if (type === "login") {
        const person = await api("login", "POST", values);
        await onLogin(person);
      } else if (type === "delete") {
        await api(`${item.resource}/${item.id}`, "DELETE");
        onSaved();
      } else {
        const resource =
          type === "listing"
            ? `shops/${values.shop_id}/listings`
            : { product: "products", shop: "shops", owner: "owners" }[type];
        await api(
          `${resource}${item.id ? `/${item.id}` : ""}`,
          item.id ? "PUT" : "POST",
          values,
        );
        onSaved();
      }
    } catch (e) {
      setMessage(e.message);
      setErrors(e.errors || {});
    } finally {
      setBusy(false);
    }
  }
  const detail = type === "detail" || type === "catalogDetail";
  const heading =
    type === "login"
      ? "Welcome to your workspace."
      : type === "delete"
        ? `Delete ${item.name}?`
        : detail
          ? item.name
          : `${item.id ? "Edit" : "Create"} ${{ product: "catalog product", listing: "shop listing", shop: "shop", owner: "shop owner" }[type]}`;
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) close();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className={`modal ${detail ? "detail-modal" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close icon-button"
          onClick={close}
          disabled={busy}
          aria-label="Close dialog"
        >
          <X size={21} />
        </button>
        {detail ? (
          <>
            <ProductImage
              src={item.thumbnail}
              name={item.name}
              className="detail-image"
            />
            <span className="eyebrow">{item.shop?.name || item.category}</span>
            <h2 id="modal-title">{heading}</h2>
            <strong className="detail-price">{money(item.price)}</strong>
            <p className="detail-description">{item.description}</p>
            {item.product?.sku && (
              <p className="muted">SKU: {item.product.sku}</p>
            )}
            {type === "catalogDetail" && user && (
              <button className="primary-button" onClick={() => onAdd(item)}>
                <Plus size={17} />
                Add to your shop
              </button>
            )}
          </>
        ) : (
          <form onSubmit={submit}>
            <span className="eyebrow">
              {type === "login"
                ? "COMMON GOODS / WORKSPACE"
                : type === "delete"
                  ? "PLEASE CONFIRM"
                  : "MAKE IT YOUR OWN"}
            </span>
            <h2 id="modal-title">{heading}</h2>
            <p className="modal-intro">
              {type === "login"
                ? "Sign in to manage your shop and discover your next bestseller."
                : type === "delete"
                  ? item.warning
                  : type === "listing"
                    ? "These details belong to this shop. Customize them without changing the shared catalog."
                    : type === "product"
                      ? "This product will be available to every shop in the shared catalog."
                      : "Keep your marketplace connected and up to date."}
            </p>
            {message && (
              <div role="alert" className="error-banner">
                {message}
              </div>
            )}
            <div className="form-grid">
              {type === "login" && (
                <>
                  {field("email", "Email address", "email", { wide: true })}
                  {field("password", "Password", "password", { wide: true })}
                </>
              )}
              {type === "owner" && (
                <>
                  {field("name", "Full name", "text", { wide: true })}
                  {field("email", "Email address", "email", { wide: true })}
                  {field(
                    "password",
                    item.id
                      ? "New password (leave blank to keep current)"
                      : "Password (at least 8 characters)",
                    "password",
                    { required: !item.id, wide: true },
                  )}
                </>
              )}
              {type === "shop" && (
                <>
                  {field("name", "Shop name")}
                  {field("slug", "URL slug", "text", {
                    placeholder: "my-lovely-shop",
                  })}
                  {field("owner_id", "Shop owner", "select", {
                    wide: true,
                    options: [
                      { value: "", label: "Select an owner" },
                      ...data.owners.map((o) => ({
                        value: o.id,
                        label: `${o.name} — ${o.email}`,
                      })),
                    ],
                  })}
                  {field("description", "Description", "textarea", {
                    required: false,
                    wide: true,
                  })}
                </>
              )}
              {(type === "product" || type === "listing") && (
                <>
                  {type === "listing" &&
                    field("shop_id", "Shop", "select", {
                      wide: true,
                      options: data.shops
                        .filter((s) =>
                          item.id
                            ? s.id === item.shop_id
                            : !data.listings.some(
                                (l) =>
                                  l.shop_id === s.id &&
                                  l.product_id === values.product_id,
                              ),
                        )
                        .map((s) => ({ value: s.id, label: s.name })),
                    })}
                  {field("name", "Product name", "text", { wide: true })}
                  {type === "product" && (
                    <>
                      {field("sku", "Unique SKU")}
                      {field("category", "Category")}
                    </>
                  )}
                  {field("price", "Price (USD)", "number", {
                    wide: type === "listing",
                  })}
                  {field("thumbnail", "Thumbnail image URL", "url", {
                    required: false,
                    wide: true,
                    placeholder: "https://example.com/product.jpg",
                  })}
                  {field("description", "Product details", "textarea", {
                    wide: true,
                  })}
                </>
              )}
              {(type === "shop" || type === "listing") && (
                <label className="checkbox-field full-width">
                  <input
                    type="checkbox"
                    checked={values.is_active}
                    onChange={(e) => set("is_active", e.target.checked)}
                  />
                  <span>Active and visible to customers</span>
                </label>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="subtle-button"
                disabled={busy}
                onClick={close}
              >
                Cancel
              </button>
              <button
                className={
                  type === "delete" ? "danger-button" : "primary-button"
                }
                disabled={busy}
              >
                {busy ? (
                  <LoaderCircle className="spin" size={17} />
                ) : type === "delete" ? (
                  <Trash2 size={16} />
                ) : null}
                {busy
                  ? "Please wait…"
                  : type === "login"
                    ? "Sign in"
                    : type === "delete"
                      ? "Delete permanently"
                      : "Save changes"}
                {type === "login" && !busy && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
