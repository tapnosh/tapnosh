"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { RestaurantImageSchema } from "@/types/restaurant/Create";

const validateFiles = (fileList: File[]) => {
  const validFiles: File[] = [];
  const invalidFiles: string[] = [];

  fileList.forEach((file) => {
    try {
      RestaurantImageSchema.parse(file);
      validFiles.push(file);
    } catch {
      invalidFiles.push(file.name);
    }
  });

  return { validFiles, invalidFiles };
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

export default function ImageUploadDropzone({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const { validFiles, invalidFiles } = validateFiles(newFiles);

    if (invalidFiles.length > 0) {
      setErrors(
        invalidFiles.map((name) => `${name} is not a valid image file`),
      );
      setTimeout(() => setErrors([]), 5000);
    }

    console.log(validFiles);

    if (validFiles.length === 0) return;

    setFiles((prev) => [...prev, ...validFiles]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
      }
    },
    [addFiles],
  );

  const removeFile = useCallback((i: number) => {
    setFiles((prev) => prev.toSpliced(i, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleReorderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleReorderDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleReorderDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);

    setFiles(newFiles);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      {/* Drop Zone */}
      <Card
        className={cn(
          "cursor-pointer border-2 border-dashed transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div
            className={cn(
              "mb-4 rounded-full p-4 transition-colors",
              isDragOver ? "bg-primary/10" : "bg-muted",
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragOver ? "text-primary" : "text-muted-foreground",
              )}
            />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragOver ? "Drop images here" : "Drag & drop images here"}
            </p>
            <p className="text-muted-foreground text-sm">
              or click to browse image files (JPG, PNG, SVG etc.)
            </p>
          </div>
          <Button variant="outline" className="mt-4" asChild>
            <span>
              <Plus className="mr-2 h-4 w-4" />
              Choose Files
            </span>
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*"
      />

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Uploaded images ({files.length})</h3>
            <Button variant="outline" size="sm" onClick={() => setFiles([])}>
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => {
              const isDragging = draggedIndex === index;
              const isDragTarget = dragOverIndex === index;

              return (
                <Card
                  key={index}
                  className={cn(
                    "transform p-0 transition-all duration-300 ease-in-out",
                    isDragging && "scale-95 rotate-2 opacity-50 shadow-lg",
                    isDragTarget && "border-primary bg-primary/5 scale-105",
                    !isDragging && !isDragTarget && "hover:shadow-md",
                  )}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleReorderDrop(e, index)}
                  onDragOver={(e) => handleReorderDragOver(e, index)}
                  onDragLeave={handleReorderDragLeave}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="min-w-[2rem] justify-center font-mono text-xs"
                      >
                        {index + 1}
                      </Badge>
                      <GripVertical className="text-muted-foreground h-4 w-4 cursor-grab active:cursor-grabbing" />
                    </div>

                    <div className="flex-shrink-0">
                      <div className="bg-muted flex size-24 items-center justify-center rounded-lg p-2">
                        <Image
                          width={128}
                          height={128}
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                        />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {file.name || "Unnamed file"}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      type="button"
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
