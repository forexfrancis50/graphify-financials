import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Download, Settings } from "lucide-react";
import { exportToPDF } from "@/utils/exportUtils";

interface ReportTemplate {
  name: string;
  sections: string[];
  includeCharts: boolean;
  includeTables: boolean;
  headerLogo?: boolean;
  footerNotes?: string;
}

export function ReportGenerator() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("detailed");
  const [customTemplate, setCustomTemplate] = useState<ReportTemplate>({
    name: "Custom Template",
    sections: ["Executive Summary", "Financial Analysis", "Metrics", "Conclusion"],
    includeCharts: true,
    includeTables: true,
    headerLogo: true,
    footerNotes: "Generated using Financial Analysis Suite",
  });

  const templates: Record<string, ReportTemplate> = {
    detailed: {
      name: "Detailed Analysis",
      sections: [
        "Executive Summary",
        "Company Overview",
        "Financial Analysis",
        "Market Analysis",
        "Risk Assessment",
        "Recommendations",
      ],
      includeCharts: true,
      includeTables: true,
      headerLogo: true,
    },
    summary: {
      name: "Executive Summary",
      sections: ["Key Highlights", "Financial Metrics", "Recommendations"],
      includeCharts: true,
      includeTables: false,
      headerLogo: true,
    },
    metrics: {
      name: "Metrics Report",
      sections: ["Financial Metrics", "Ratio Analysis", "Trend Analysis"],
      includeCharts: true,
      includeTables: true,
      headerLogo: false,
    },
  };

  const generateReport = () => {
    const template = selectedTemplate === "custom" ? customTemplate : templates[selectedTemplate];
    
    const reportData = {
      title: template.name,
      sections: template.sections.map(section => ({
        title: section,
        content: `Sample content for ${section}`,
      })),
    };

    exportToPDF(template.name, reportData.sections, ["title", "content"]);

    toast({
      title: "Report Generated",
      description: `${template.name} has been generated and downloaded`,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Report Generator</h2>
        </div>
        <Button onClick={generateReport} className="gap-2">
          <Download className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(templates).map(([key, template]) => (
              <Card
                key={key}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  selectedTemplate === key ? "border-primary" : ""
                }`}
                onClick={() => setSelectedTemplate(key)}
              >
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {template.sections.length} sections
                </p>
                <ul className="text-sm space-y-1">
                  {template.sections.slice(0, 3).map((section) => (
                    <li key={section}>• {section}</li>
                  ))}
                  {template.sections.length > 3 && (
                    <li>• ...and {template.sections.length - 3} more</li>
                  )}
                </ul>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customize">
          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={customTemplate.name}
                onChange={(e) =>
                  setCustomTemplate({ ...customTemplate, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Sections</Label>
              <div className="space-y-2">
                {customTemplate.sections.map((section, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={section}
                      onChange={(e) => {
                        const newSections = [...customTemplate.sections];
                        newSections[index] = e.target.value;
                        setCustomTemplate({
                          ...customTemplate,
                          sections: newSections,
                        });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCustomTemplate({
                          ...customTemplate,
                          sections: customTemplate.sections.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setCustomTemplate({
                      ...customTemplate,
                      sections: [...customTemplate.sections, "New Section"],
                    })
                  }
                >
                  Add Section
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={customTemplate.includeCharts}
                  onChange={(e) =>
                    setCustomTemplate({
                      ...customTemplate,
                      includeCharts: e.target.checked,
                    })
                  }
                />
                Include Charts
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={customTemplate.includeTables}
                  onChange={(e) =>
                    setCustomTemplate({
                      ...customTemplate,
                      includeTables: e.target.checked,
                    })
                  }
                />
                Include Tables
              </label>
            </div>

            <div>
              <Label htmlFor="footerNotes">Footer Notes</Label>
              <Input
                id="footerNotes"
                value={customTemplate.footerNotes}
                onChange={(e) =>
                  setCustomTemplate({
                    ...customTemplate,
                    footerNotes: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}