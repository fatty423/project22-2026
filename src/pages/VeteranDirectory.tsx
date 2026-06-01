import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Filter, Heart, Play, X, Footprints, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { SponsorshipCheckout } from '../components/SponsorshipCheckout';
import { HeroTimeline } from '../components/HeroTimeline';
import { supabase, Database } from '../lib/supabase';
import { formatFundingPercent, fundingBarPercent } from '../lib/funding';

type Hero = Database['public']['Tables']['veterans']['Row'];
type VeteranProgress = Database['public']['Tables']['veteran_progress']['Row'];

export function VeteranDirectory() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showSponsorshipModal, setShowSponsorshipModal] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [heroMilestones, setHeroMilestones] = useState<Record<string, VeteranProgress[]>>({});

  const navigate = useNavigate();
  const branches = ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force', 'Law Enforcement', 'Fire Department', 'EMS/EMT', 'Dispatch', 'Corrections'];
  const genders = ['Male', 'Female'];

  useEffect(() => {
    fetchHeroes();
  }, []);

  useEffect(() => {
    filterHeroes();
  }, [heroes, searchTerm, selectedBranch, selectedGender, selectedLocation]);

  const fetchHeroes = async () => {
    try {
      const { data, error } = await supabase
        .from('veterans')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHeroes(data || []);

      if (data && data.length > 0) {
        const heroIds = data.map((h) => h.id);
        const { data: milestones } = await supabase
          .from('veteran_progress')
          .select('id, veteran_id, milestone, status, completion_percentage, sort_order, description, completed_at, created_at')
          .in('veteran_id', heroIds)
          .order('sort_order', { ascending: true });

        if (milestones) {
          const grouped: Record<string, VeteranProgress[]> = {};
          for (const m of milestones) {
            if (!grouped[m.veteran_id]) grouped[m.veteran_id] = [];
            grouped[m.veteran_id].push(m);
          }
          setHeroMilestones(grouped);
        }
      }
    } catch (error) {
      console.error('Error fetching heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterHeroes = () => {
    let filtered = [...heroes];

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.career_goals.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.biography.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.current_location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBranch !== 'all') {
      filtered = filtered.filter((v) => v.military_branch === selectedBranch);
    }

    if (selectedGender !== 'all') {
      filtered = filtered.filter((v) => v.gender === selectedGender);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter((v) => v.current_location === selectedLocation);
    }

    setFilteredHeroes(filtered);
  };

  const uniqueLocations = [...new Set(heroes.map((v) => v.current_location))].sort();

  const handleSponsorClick = (hero: Hero) => {
    setSelectedHero(hero);
    setShowSponsorshipModal(true);
  };

  const handleVideoClick = (url: string) => {
    setVideoUrl(url);
    setShowVideoModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBranch('all');
    setSelectedGender('all');
    setSelectedLocation('all');
  };

  const activeFiltersCount = [
    searchTerm,
    selectedBranch !== 'all',
    selectedGender !== 'all',
    selectedLocation !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative bg-brand-marine text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Heroes Directory
            </h1>
            <p className="text-xl text-slate-200 mb-8">
              Meet the veterans and first responders waiting for sponsorship and follow their journey to success
            </p>
            <div className="flex items-center justify-center gap-8 text-lg">
              <div>
                <span className="text-4xl font-bold">{heroes.length}</span>
                <span className="text-slate-300 ml-2">Heroes</span>
              </div>
              <div>
                <span className="text-4xl font-bold">
                  {heroes.filter((v) => !v.is_sponsored).length}
                </span>
                <span className="text-slate-300 ml-2">Waiting for Sponsor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white mb-8">
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, location, or career goals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-marine focus:border-transparent"
                    />
                  </div>
                </div>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Service Background
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-marine focus:border-transparent"
                  >
                    <option value="all">All Backgrounds</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Gender
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-marine focus:border-transparent"
                  >
                    <option value="all">All</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-marine focus:border-transparent"
                  >
                    <option value="all">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-semibold">{filteredHeroes.length}</span> of{' '}
                  <span className="font-semibold">{heroes.length}</span> heroes
                </p>
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-marine" />
              <p className="mt-4 text-slate-600">Loading heroes...</p>
            </div>
          ) : filteredHeroes.length === 0 ? (
            <Card className="text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No heroes found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search filters
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHeroes.map((hero) => (
                <Card
                  key={hero.id}
                  hover
                  className="cursor-pointer"
                >
                  <div
                    onClick={() => {
                      navigate(`/heroes/${hero.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="relative">
                      <div className="aspect-square bg-slate-200 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={hero.photo_url}
                          alt={`${hero.first_name} ${hero.last_initial}.`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {hero.is_sponsored && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Sponsored
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                      {hero.first_name} {hero.last_initial}.
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                      <span className="font-semibold text-brand-marine">
                        {hero.military_branch}
                      </span>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{hero.current_location}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">
                          Career Goals:
                        </p>
                        <p className="text-sm text-slate-600">{hero.career_goals}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">About:</p>
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {hero.biography}
                        </p>
                      </div>
                    </div>

                    {!hero.is_sponsored && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            Funding Progress
                          </span>
                          <span className="text-sm font-bold text-brand-marine">
                            {formatFundingPercent(
                              hero.sponsorship_amount_raised,
                              hero.sponsorship_amount_needed
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-brand-marine h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${fundingBarPercent(
                                hero.sponsorship_amount_raised,
                                hero.sponsorship_amount_needed
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-600">
                          <span>${hero.sponsorship_amount_raised.toFixed(0)} raised</span>
                          <span>${hero.sponsorship_amount_needed.toFixed(0)} goal</span>
                        </div>
                      </div>
                    )}

                    {heroMilestones[hero.id]?.length > 0 ? (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        <HeroTimeline milestones={heroMilestones[hero.id]} compact />
                      </div>
                    ) : (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg flex items-center gap-2">
                        <Footprints className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-400">Journey begins when sponsored</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    {hero.video_url && (
                      <Button
                        fullWidth
                        variant="outline"
                        onClick={() => handleVideoClick(hero.video_url!)}
                        className="flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Watch Video
                      </Button>
                    )}
                    {hero.is_sponsored ? (
                      <Button
                        fullWidth
                        disabled
                        className="flex items-center justify-center gap-2 !bg-slate-200 !text-slate-500 !opacity-70 cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Funded!
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        onClick={() => handleSponsorClick(hero)}
                        className="flex items-center justify-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Sponsor Now
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedHero && (
        <SponsorshipCheckout
          veteran={selectedHero}
          isOpen={showSponsorshipModal}
          onClose={() => setShowSponsorshipModal(false)}
        />
      )}

      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        maxWidth="xl"
      >
        <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
          {videoUrl && (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
