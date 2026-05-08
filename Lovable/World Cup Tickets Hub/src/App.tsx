import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";
import Stadiums from "./pages/Stadiums";
import StadiumDetail from "./pages/StadiumDetail";
import Teams from "./pages/Teams";
import Groups from "./pages/Groups";
import Standings from "./pages/Standings";
import Qualified from "./pages/Qualified";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminMatches from "./pages/admin/AdminMatches";
import AdminStadiums from "./pages/admin/AdminStadiums";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSales from "./pages/admin/AdminSales";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="matches" element={<AdminMatches />} />
                <Route path="stadiums" element={<AdminStadiums />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="sales" element={<AdminSales />} />
              </Route>

              {/* Public Routes */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/matches" element={<Layout><Matches /></Layout>} />
              <Route path="/matches/:id" element={<Layout><MatchDetail /></Layout>} />
              <Route path="/stadiums" element={<Layout><Stadiums /></Layout>} />
              <Route path="/stadiums/:id" element={<Layout><StadiumDetail /></Layout>} />
              <Route path="/teams" element={<Layout><Teams /></Layout>} />
              <Route path="/groups" element={<Layout><Groups /></Layout>} />
              <Route path="/standings" element={<Layout><Standings /></Layout>} />
              <Route path="/qualified" element={<Layout><Qualified /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/register" element={<Layout><Register /></Layout>} />
              <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
              <Route path="/payment-confirmation" element={<Layout><PaymentConfirmation /></Layout>} />
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
