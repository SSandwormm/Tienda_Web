import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { listAddresses } from "../services/addressService.js";
import { listPaymentMethods } from "../services/paymentMethodService.js";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import ProfileTabs, {
  PROFILE_TABS,
} from "../components/profile/ProfileTabs.jsx";
import PersonalDataTab from "../components/profile/PersonalDataTab.jsx";
import AddressesTab from "../components/profile/AddressesTab.jsx";
import PaymentMethodsTab from "../components/profile/PaymentMethodsTab.jsx";
import OrdersTab from "../components/profile/OrdersTab.jsx";
import "../styles/profile.css";

const validTabs = new Set(PROFILE_TABS.map((tab) => tab.id));

export default function Profile() {
  const {
    user,
    profile,
    isAdmin,
    logout,
    profileError,
    retryProfile,
    updateProfile,
  } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    validTabs.has(requestedTab) ? requestedTab : "datos",
  );
  const [loadedTabs, setLoadedTabs] = useState(() => new Set([activeTab]));
  const [pageError, setPageError] = useState("");
  const [success, setSuccess] = useState("");
  const [summary, setSummary] = useState({
    orders: 0,
    addresses: 0,
    payments: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      if (!user?.id) return;
      setSummaryLoading(true);
      const [addressesResult, paymentsResult] = await Promise.allSettled([
        listAddresses(user.id),
        listPaymentMethods(user.id),
      ]);
      if (!active) return;
      setSummary({
        orders: 0,
        addresses:
          addressesResult.status === "fulfilled"
            ? addressesResult.value.length
            : 0,
        payments:
          paymentsResult.status === "fulfilled"
            ? paymentsResult.value.length
            : 0,
      });
      setSummaryLoading(false);
    }

    loadSummary();
    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (validTabs.has(requestedTab)) setActiveTab(requestedTab);
    else if (requestedTab) setSearchParams({ tab: "datos" }, { replace: true });
  }, [requestedTab, setSearchParams]);

  const changeTab = (tab) => {
    if (!validTabs.has(tab)) return;
    setActiveTab(tab);
    setLoadedTabs((current) => new Set([...current, tab]));
    setSearchParams({ tab }, { replace: false });
    setPageError("");
  };

  const showMessage = (message) => {
    setPageError("");
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 3500);
  };

  const handleProfileSave = async (updates) => {
    try {
      await updateProfile(updates);
      showMessage("Perfil actualizado correctamente.");
    } catch (error) {
      setPageError(error.message || "No se pudo guardar el perfil.");
      throw error;
    }
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0] || "?").toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
      })
    : "—";
  const displayName =
    profile?.full_name?.trim() || user?.email?.split("@")[0] || "tu cuenta";
  const profileIncomplete =
    !profile?.full_name || !profile?.phone || summary.addresses === 0;
  const profileCompletion =
    [
      profile?.full_name,
      profile?.phone,
      profile?.document_type && profile?.document_number,
      summary.addresses > 0,
    ].filter(Boolean).length * 25;

  const renderTab = (tab) => {
    if (tab === "direcciones")
      return <AddressesTab userId={user?.id} onMessage={showMessage} />;
    if (tab === "pagos")
      return <PaymentMethodsTab userId={user?.id} onMessage={showMessage} />;
    if (tab === "pedidos") return <OrdersTab />;
    return (
      <div
        id="profile-panel-datos"
        role="tabpanel"
        aria-labelledby="profile-tab-datos"
        className="profile-tab-content"
      >
        <PersonalDataTab
          profile={profile}
          user={user}
          onSave={handleProfileSave}
          saving={false}
          error={pageError}
          success={success}
        />
      </div>
    );
  };

  return (
    <div className="profile-page profile-page--standalone">
      <div className="profile-topbar">
        <Link to="/tienda" className="profile-back">
          ← VOLVER A LA TIENDA
        </Link>
        <Link to="/carrito" className="profile-cart-link">
          CARRITO {cart.length > 0 ? `(${cart.length})` : ""} →
        </Link>
      </div>
      <div className="profile-container">
        <ProfileHeader
          user={user}
          isAdmin={isAdmin}
          initials={initials}
          memberSince={memberSince}
          displayName={displayName}
          onLogout={async () => {
            await logout();
            navigate("/");
          }}
        />
        <main className="profile-main">
          {(pageError || profileError) && activeTab === "datos" && (
            <div className="profile-error" role="alert">
              {profileError ? (
                <>
                  <span>No se pudo cargar tu perfil.</span>
                  <button type="button" onClick={retryProfile}>
                    Reintentar
                  </button>
                </>
              ) : (
                pageError
              )}
            </div>
          )}
          {success && (
            <div className="profile-success" role="status">
              {success}
            </div>
          )}
          <ProfileTabs
            activeTab={activeTab}
            onChange={changeTab}
            counts={{
              pedidos: summary.orders,
              direcciones: summaryLoading ? null : summary.addresses,
              pagos: summaryLoading ? null : summary.payments,
            }}
            profileIncomplete={profileIncomplete}
          />
          <section className="profile-content-panel" aria-live="polite">
            {PROFILE_TABS.filter((tab) => loadedTabs.has(tab.id)).map((tab) => (
              <div
                className={`profile-tab-shell ${activeTab === tab.id ? "is-active" : ""}`}
                key={tab.id}
              >
                {renderTab(tab.id)}
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
