import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTemplates, fetchTemplateById, saveTemplate, deleteTemplate } from '../api';

export interface Template {
  id: string;
  name: string;
  created_at: string;
}

export interface TemplateDetail extends Template {
  content: unknown[];
  updated_at: string;
}

export const useTemplates = () =>
  useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data } = await fetchTemplates();
      return data;
    },
  });

export const useTemplateById = (id?: string) =>
  useQuery<TemplateDetail>({
    queryKey: ['template', id],
    queryFn: async () => {
      const { data } = await fetchTemplateById(id);
      return data;
    },
    enabled: !!id,
  });

export const useSaveTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; content: unknown[]; id?: string }) =>
      saveTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};
