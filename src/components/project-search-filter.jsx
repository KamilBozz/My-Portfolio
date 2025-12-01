"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/project-card";

export default function ProjectSearchFilter({ projects }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  // Extract unique tags from all projects
  const uniqueTags = useMemo(() => {
    const tagsSet = new Set();
    projects.forEach((project) => {
      if (project.keywords && Array.isArray(project.keywords)) {
        project.keywords.forEach((tag) => {
          if (tag && tag.trim()) {
            tagsSet.add(tag.trim());
          }
        });
      }
    });
    return Array.from(tagsSet).sort();
  }, [projects]);

  // Filter projects based on search query and selected tag
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter - case-insensitive match against title or description
      const matchesSearch =
        searchQuery === "" ||
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter - must match selected tag (if one is selected)
      const matchesTag =
        selectedTag === null ||
        (project.keywords &&
          Array.isArray(project.keywords) &&
          project.keywords.some(
            (tag) => tag && tag.trim().toLowerCase() === selectedTag.toLowerCase()
          ));

      return matchesSearch && matchesTag;
    });
  }, [projects, searchQuery, selectedTag]);

  // Handle tag click - toggle selection
  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // Deselect if clicking the same tag
    } else {
      setSelectedTag(tag); // Select the new tag
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
  };

  return (
    <div className="w-full">
      {/* Search and Filter Section */}
      <div className="px-4 py-6 space-y-4">
        {/* Search Input */}
        <div className="w-full max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Tag Filters */}
        {uniqueTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {uniqueTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Filter Info and Clear Button */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
          {(searchQuery || selectedTag) && (
            <button
              onClick={clearFilters}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Filtered Projects Grid */}
      <div className="flex flex-wrap justify-center gap-6 px-4 pb-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id || project.title} project={project} />
          ))
        ) : (
          <div className="w-full text-center py-12 text-muted-foreground">
            <p className="text-lg">No projects found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

