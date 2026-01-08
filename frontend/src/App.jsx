import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ClientLayout from './layouts/ClientLayout';
import Home from './pages/Home';
import Placeholder from './components/shared/Placeholder';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import AdminCategories from './pages/admin/AdminCategories';
import Orders from './pages/admin/Orders';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminTeam from './pages/admin/AdminTeam';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminAds from './pages/admin/AdminAds';
import AdminMessages from "./pages/admin/AdminMessages";
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Catalogue from './pages/Catalogue';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import ProductDetails from './pages/ProductDetails';
import NotFound from './pages/NotFound';
import { Navigate } from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';

function App() {
  console.log("App component rendering");
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ClientLayout />}>
                {/* Client Routes */}
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<BlogDetails />} />
                <Route path="shop" element={<Shop />} />
                <Route path="catalogue" element={<Catalogue />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="profile" element={<Profile />} />
                <Route path="login" element={<Navigate to="/auth/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />


              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="blogs" element={<AdminBlogs />} />
                {/* <Route path="team" element={<AdminTeam />} /> */}
                {/* <Route path="testimonials" element={<AdminTestimonials />} /> */}
                {/* <Route path="ads" element={<AdminAds />} /> */}
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
