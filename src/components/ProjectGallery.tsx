import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

interface ProjectGalleryProps {
  category?: string;
  featured?: boolean;
  limit?: number;
}

const ProjectGallery = ({ category, featured, limit }: ProjectGalleryProps) => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', category, featured, limit],
    queryFn: async () => {
      let query = supabase
        .from('project_media')
        .select('*')
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }

      if (featured) {
        query = query.eq('is_featured', true);
      }

      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <GlassCard key={project.id} hover className="overflow-hidden group">
          <div className="relative aspect-square overflow-hidden">
            <img 
              src={project.image_url} 
              alt={project.title || `Carolina Terrain project in ${project.location || 'Charlotte area'}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {(project.title || project.location || project.description) && (
            <div className="p-4 space-y-2">
              {project.title && (
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {project.title}
                </h3>
              )}
              
              {project.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{project.location}</span>
                </div>
              )}
              
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
};

export default ProjectGallery;