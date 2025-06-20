"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PrintTemplates() {
  const templates = [
    { name: "Table Tent", size: '4" x 6" folded', description: "Table Tent" },
    { name: "Wall Poster", size: '8.5" x 11"', description: "Poster" },
    { name: "Round Sticker", size: '3" diameter', description: "Sticker" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Print-Ready Templates</CardTitle>
        <CardDescription>
          Choose from pre-designed templates for table tents, posters, and
          stickers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.name}
              className="cursor-pointer rounded-lg border p-4 text-center hover:bg-gray-50"
            >
              <div className="mb-2 flex h-24 w-full items-center justify-center rounded bg-gray-100">
                <span className="text-xs text-gray-500">
                  {template.description}
                </span>
              </div>
              <p className="font-medium">{template.name}</p>
              <p className="text-sm text-gray-500">{template.size}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
