import axiosInstance from './axios';

export interface HackathonFormData {
  title: string;
  description: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  registrationDeadline: Date;
  maxParticipants: number;
  package: 'starter' | 'growth' | 'scale';
  prizePool: string;
  prizes: Array<{
    place: string;
    amount: string;
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
  isPrivate: boolean;
  tags: string[];
}

export const hackathonApi = {
  // Create a new hackathon
  createHackathon: async (data: HackathonFormData) => {
    const response = await axiosInstance.post('/hackathons', data);
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