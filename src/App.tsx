import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ScrollToTop } from './components/ScrollToTop';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Programs } from './pages/Programs';
import { WaitingList } from './pages/WaitingList';
import { Impact } from './pages/Impact';
import { VeteranApply } from './pages/VeteranApply';
import { Contact } from './pages/Contact';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SuccessPage } from './pages/SuccessPage';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { WaysToHelp } from './pages/WaysToHelp';
import { Partnership } from './pages/Partnership';
import { VeteranDirectory } from './pages/VeteranDirectory';
import { VeteranDetail } from './pages/VeteranDetail';
import { SponsorAVeteran } from './pages/SponsorAVeteran';
import { DonorPortal } from './pages/DonorPortal';
import { Donate } from './pages/Donate';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Accessibility } from './pages/Accessibility';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminHeroes } from './pages/admin/AdminHeroes';
import { AdminDonors } from './pages/admin/AdminDonors';
import { AdminHeroUpdates } from './pages/admin/AdminHeroUpdates';
import { AdminHeroJourney } from './pages/admin/AdminHeroJourney';
import { HeroLogin } from './pages/hero/HeroLogin';
import { HeroPortal } from './pages/hero/HeroPortal';
import { HeroUpdateEditor } from './pages/hero/HeroUpdateEditor';
import { AdminLayout } from './components/AdminLayout';
import { AdvancedTraining } from './pages/AdvancedTraining';
import { ExpertInstructors } from './pages/ExpertInstructors';
import { CareerSupport } from './pages/CareerSupport';
import { PersonalDevelopment } from './pages/PersonalDevelopment';
import { AlumniNetwork } from './pages/AlumniNetwork';
import { FamilyWellness } from './pages/FamilyWellness';
import { PartnerPatches } from './pages/PartnerPatches';
import { DocSclaterMemorial } from './pages/DocSclaterMemorial';
import { DocSclaterScholarship } from './pages/DocSclaterScholarship';

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/waiting-list" element={<WaitingList />} />
              <Route path="/help" element={<WaysToHelp />} />
              <Route path="/partnership" element={<Partnership />} />
              <Route path="/heroes" element={<VeteranDirectory />} />
              <Route path="/heroes/:id" element={<VeteranDetail />} />
              <Route path="/apply" element={<VeteranApply />} />
              <Route path="/veteran-apply" element={<VeteranApply />} />
              <Route path="/sponsor" element={<SponsorAVeteran />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/portal" element={<DonorPortal />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/advanced-training" element={<AdvancedTraining />} />
              <Route path="/expert-instructors" element={<ExpertInstructors />} />
              <Route path="/career-support" element={<CareerSupport />} />
              <Route path="/personal-development" element={<PersonalDevelopment />} />
              <Route path="/alumni-network" element={<AlumniNetwork />} />
              <Route path="/family-wellness" element={<FamilyWellness />} />
              <Route path="/partner-patches" element={<PartnerPatches />} />
              <Route path="/doc-sclater" element={<DocSclaterMemorial />} />
              <Route path="/doc-sclater-scholarship" element={<DocSclaterScholarship />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/heroes" element={<AdminHeroes />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/programs" element={<AdminPrograms />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/donors" element={<AdminDonors />} />
              <Route path="/admin/hero-updates" element={<AdminLayout><AdminHeroUpdates /></AdminLayout>} />
              <Route path="/admin/heroes/:id/journey" element={<AdminLayout><AdminHeroJourney /></AdminLayout>} />
              <Route path="/hero/login" element={<HeroLogin />} />
              <Route path="/hero" element={<HeroPortal />} />
              <Route path="/hero/updates/new" element={<HeroUpdateEditor />} />
              <Route path="/hero/updates/:id" element={<HeroUpdateEditor />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
