import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export type DCFTemplate = {
  id: string;
  name: string;
  description: string;
  sections: string[];
};

const templates: DCFTemplate[] = [
  {
    id: "detailed",
    name: "Detailed Analysis",
    description: "Comprehensive view with all metrics and assumptions",
    sections: ["assumptions", "projections", "valuation", "sensitivity", "charts"],
  },
  {
    id: "executive",
    name: "Executive Summary",
    description: "High-level overview focusing on key metrics",
    sections: ["keyMetrics", "valuation", "charts"],
  },
  {
    id: "investor",
    name: "Investor Presentation",
    description: "Visual-focused format with key charts and metrics",
    sections: ["charts", "keyMetrics", "sensitivity"],
  },
  {
    id: "banking",
    name: "Investment Banking",
    description: "Detailed format with comparable analysis",
    sections: ["assumptions", "projections", "comps", "sensitivity", "valuation"],
  },
];

interface DCFTemplatesProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export function DCFTemplates({ selectedTemplate, onTemplateChange }: DCFTemplatesProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Output Template</h3>
      <div className="space-y-4">
        <Select value={selectedTemplate} onValueChange={onTemplateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="text-sm text-muted-foreground">
          {templates.find(t => t.id === selectedTemplate)?.description}
        </div>
        
        <div className="text-sm">
          <span className="font-medium">Included sections: </span>
          {templates.find(t => t.id === selectedTemplate)?.sections.join(", ")}
        </div>
      </div>
    </Card>
  );
}