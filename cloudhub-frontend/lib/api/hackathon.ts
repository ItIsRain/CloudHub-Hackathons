import axiosInstance from './axios';

export interface HackathonFormData {
  title: string;
  description: string;
  short_description: string;
  organization_name: string;
  cover_image?: string | null;
  banner_image?: string | null;
  organization_logo?: string | null;
  dateRange: {
    from: Date;
    to: Date;
  };
  registrationDeadline: Date;
  maxParticipants: number;
  min_team_size: number;
  max_team_size: number;
  is_team_required: boolean;
  package: 'starter' | 'growth' | 'scale';
  prizePool: string;
  prizes: Array<{
    place: string;
    amount: string;
    position: number;
    description: string;
    currency: string;
  }>;
  judgingCriteria: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
  challenges: Array<{
    title: string;
    description: string;
  }>;
  rules: string;
  requirements: string[];
  resources: string[];
  submission_template: string | null;
  isPrivate: boolean;
  tags: string[];
}

interface BackendHackathonData {
  title: string;
  description: string;
  short_description: string;
  organization_name: string;
  timeline: {
    registration_start: string;
    registration_end: string;
    event_start: string;
    event_end: string;
    judging_start: string;
    judging_end: string;
    winners_announcement: string;
  };
  max_participants: number;
  billing: {
    package: string;
    amount: number;
    currency: string;
  };
  prizes: Array<{
    position: number;
    amount: number;
    description: string;
    currency: string;
  }>;
  judging_criteria: string[];
  requirements: string[];
  rules: string[];
  tags: string[];
  is_private: boolean;
}

export const hackathonApi = {
  // Create a new hackathon
  createHackathon: async (data: HackathonFormData) => {
    // Helper function to format dates to match backend expectations
    const formatDate = (date: Date | string | undefined): string => {
      if (!date) {
        return new Date().toISOString().split('.')[0] + 'Z';
      }
      
      // Convert to Date object if it's a string
      const validDate = date instanceof Date ? date : new Date(date);
      
      // Check if the date is valid
      if (isNaN(validDate.getTime())) {
        console.warn('Invalid date provided, using current date as fallback');
        return new Date().toISOString().split('.')[0] + 'Z';
      }
      
      // Format to ISO string without milliseconds and ensure UTC
      return validDate.toISOString().split('.')[0] + 'Z';
    };

    // Transform the data to match backend schema
    const backendData: BackendHackathonData = {
      title: data.title,
      description: data.description,
      short_description: data.short_description || data.description.substring(0, 200),
      organization_name: data.organization_name || 'Default Organization',
      timeline: {
        registration_start: formatDate(new Date()),
        registration_end: formatDate(data.registrationDeadline),
        event_start: formatDate(data.dateRange.from),
        event_end: formatDate(data.dateRange.to),
        judging_start: formatDate(data.dateRange.to),
        judging_end: formatDate(new Date(data.dateRange.to.getTime() + 24 * 60 * 60 * 1000)),
        winners_announcement: formatDate(new Date(data.dateRange.to.getTime() + 48 * 60 * 60 * 1000))
      },
      max_participants: data.maxParticipants,
      billing: {
        package: data.package.toLowerCase(),
        amount: parseFloat(data.prizePool) || 0,
        currency: 'AED'
      },
      prizes: data.prizes.map((prize, index) => ({
        position: prize.position || index + 1,
        amount: parseFloat(prize.amount) || 0,
        description: prize.description || prize.place,
        currency: prize.currency || 'AED'
      })),
      judging_criteria: data.judgingCriteria.map(criteria => criteria.name),
      requirements: data.requirements || [],
      rules: data.rules ? [data.rules] : [],
      tags: data.tags || [],
      is_private: data.isPrivate || false
    };

    console.log('Sending hackathon data:', JSON.stringify(backendData, null, 2));

    const response = await axiosInstance.post('/hackathons', backendData);
    return response.data;
  },

  // Get all hackathons with optional filters
  getHackathons: async (params?: {
    status?: string;
    category?: string;
    featured?: boolean;
  }) => {
    const response = await axiosInstance.get('/hackathons', { params });
    return response.data;
  },

  // Get a specific hackathon by ID
  getHackathon: async (id: string) => {
    const response = await axiosInstance.get(`/hackathons/${id}`);
    return response.data;
  },

  // Update a hackathon
  updateHackathon: async (id: string, data: Partial<HackathonFormData>) => {
    const response = await axiosInstance.put(`/hackathons/${id}`, data);
    return response.data;
  },

  // Delete a hackathon
  deleteHackathon: async (id: string) => {
    const response = await axiosInstance.delete(`/hackathons/${id}`);
    return response.data;
  },

  // Register for a hackathon
  registerForHackathon: async (id: string) => {
    const response = await axiosInstance.post(`/hackathons/${id}/register`);
    return response.data;
  },

  // Unregister from a hackathon
  unregisterFromHackathon: async (id: string) => {
    const response = await axiosInstance.post(`/hackathons/${id}/unregister`);
    return response.data;
  },

  // Get hackathon participants
  getHackathonParticipants: async (id: string) => {
    const response = await axiosInstance.get(`/hackathons/${id}/participants`);
    return response.data;
  }
};