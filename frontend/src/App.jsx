import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './components/login/Login'
import Home from './components/home/Home'
import Dashboard from './components/home/Dashboard'
import Members from './components/membersManagment/members/Members';
import Events from './components/membersManagment/events/Events';
import EventDetails from './components/membersManagment/events/EventDetails';
import CssBaseline from '@mui/material/CssBaseline';
import Family from './components/membersManagment/family/Family';
import LedgerAccount from './components/chartsAccounts/LedgerAccount';
import JournalEntry from './components/finance/journalEntry/JournalEntry';
import Donations from './components/finance/donations/Donations';
import FamilyDetails from './components/membersManagment/family/FamilyDetails';
import MemberDetails from './components/membersManagment/members/MemberDetails';
import Profile from './components/security/Profile';
import ProtectedRoute from './components/security/ProtectedRoute';
import PublicRoute from './components/security/PublicRoute';
import AccessDenied from './components/security/AccessDenied';
import RegisterForm from './components/login/RegisterForm';
import RoleGuard from './components/security/RoleGuard';
import UserManagement from './components/security/UserManagement';
import Settings from './components/settings/Settings';
import AuditLog from './components/security/AuditLog';
import ExpenseInvoice from './components/finance/expenseInvoice/ExpenseInvoice';
import BalanceSheet from './components/reports/BalanceSheet';
import StatementResults from './components/reports/StatementResults';
import CashFlow from './components/reports/CashFlow';
import FinancialStatement from './components/reports/FinancialStatement';

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="members" element={<Members />} />
          <Route path="events" element={<Events />} />
          <Route path="families" element={<Family />} />
          <Route path="report" />
          <Route path="ledgerAccount" element={<LedgerAccount />} />
          <Route path="journalEntry" element={<JournalEntry />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="family/:id" element={<FamilyDetails />} />
          <Route path="member/:id" element={<MemberDetails />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin/users" element={<RoleGuard roles={["1"]}><UserManagement /></RoleGuard>} />
          <Route path="admin/audit" element={<RoleGuard roles={["1"]}><AuditLog /></RoleGuard>} />
          <Route path="expenseInvoice" element={<ExpenseInvoice />} />
          <Route path="reports/BalanceSheet" element={<BalanceSheet />} />
          <Route path="reports/StatementResults" element={<StatementResults />} />
          <Route path="reports/CashFlow" element={<CashFlow />} />
          <Route path="reports/FinancialStatement" element={<FinancialStatement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="access-denied" element={<AccessDenied />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
