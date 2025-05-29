import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import BuildIcon from '@mui/icons-material/Build';

export const getMenuItems = (value) => {
  const role = value?.user?.role;
  const brandSaas = value?.user?.brandSaas;

  const complaints = role === "ADMIN" || role === "EMPLOYEE"
    ? ['Create', 'Bulk Upload', 'Pending', 'In Progress', 'Part Pending','Assign', 'Upcomming', 'Final Verification', 'Cancel', 'Close', 'Out of Warranty', 'All Service']
    : role === "BRAND" || role === "BRAND EMPLOYEE"
      ? ['Create', 'Bulk Upload', 'Pending', 'Assign', 'In Progress', 'Part Pending', 'Upcomming', 'Final Verification','Cancel', 'Close', 'All Service']
      : role === "SERVICE"
        ? ['Pending', 'Assign', 'In Progress', 'Part Pending', 'Upcomming', 'Cancel', 'Close', 'All Service']
        : role === "TECHNICIAN"
          ? ['Assign', 'In Progress', 'Part Pending', 'Upcomming', 'Cancel', 'Close', 'All Service']
          : role === "USER"
            ? ['Create', 'All Service', 'Pending', 'Upcomming', 'Assign', 'Close']
            : ['Create', 'Pending', 'Assign', 'Upcomming', 'Close', 'All Service'];

  const userSide = role === "ADMIN"
    ? ['Brand', 'Service', 'Employee', 'Dealer', 'Customer', 'Technician']
    : (role === "BRAND" && brandSaas === "YES")
      ? ['Service', 'Dealer', 'Customer', 'Employee']
      : role === "BRAND"
        ? ['Dealer', 'Customer']
        : role === "EMPLOYEE"
          ? ['Service']
          : [];

  const productSide = role === "ADMIN"
    ? ['Category', 'Product', 'SparePart', 'Complaint Nature', "Warranty"]
    : role === "BRAND" || role === "BRAND EMPLOYEE"
      ? ['Product', 'SparePart', 'Complaint Nature', "Warranty"]
      : ['Product'];

  const inventory = role === "ADMIN"
    ? ["Inventory", "Stock", "Order"]
    : role === "BRAND" || role === "BRAND EMPLOYEE"
      ? ["Stock", "Order"]
      : ["Stock", "Order"];

  // Build the menuItems array
  const menuItems = [
    { href: '/dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    {
      text: 'Complaints',
      icon: <AssignmentIcon />,
      submenu: complaints.map(item => ({
        href: `/complaints/${item.toLowerCase().replace(/\s+/g, '-')}`,
        text: item,
        icon: <AssignmentIcon />
      }))
    },
    userSide.length > 0 && {
      text: 'Users',
      icon: <PeopleIcon />,
      submenu: userSide.map(item => ({
        href: `/users/${item.toLowerCase()}`,
        text: item,
        icon: <PeopleIcon />
      }))
    },
    productSide.length > 0 && {
      text: 'Products',
      icon: <ShoppingCartIcon />,
      submenu: productSide.map(item => ({
        href: `/products/${item.toLowerCase().replace(/\s+/g, '-')}`,
        text: item,
        icon: <CategoryIcon />
      }))
    },
    inventory.length > 0 && {
      text: 'Inventory',
      icon: <InventoryIcon />,
      submenu: inventory.map(item => ({
        href: `/inventory/${item.toLowerCase()}`,
        text: item,
        icon: <BuildIcon />
      }))
    },
    { href: '/reports', text: 'Reports', icon: <BarChartIcon /> },
  ].filter(Boolean); // Remove false items (like empty userSide/productSide)

  return menuItems;
};
