import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import CreateArticle from "./pages/admin/CreateArticle";
import ArticlesList from "./pages/admin/ArticlesList";
import EditArticle from "./pages/admin/EditArticle";
import ManageCategories from "./pages/admin/ManageCategories";
import SiteSettings from "./pages/admin/SiteSettings";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review/:slug" element={<ArticlePage />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos" element={<TermsOfService />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/create" element={<CreateArticle />} />
          <Route path="/admin/articles" element={<ArticlesList />} />
          <Route path="/admin/edit/:id" element={<EditArticle />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/admin/settings" element={<SiteSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
