import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WizardData } from "../L11-AddWizard";
import { TooltipField } from "../ui/tooltip-field";

interface CertificationsProps {
  projectData: WizardData;
  onDataUpdate: (data: WizardData) => void;
}

export const AddCertifications = ({
  projectData,
  onDataUpdate,
}: CertificationsProps) => {
  const handleInputChange = (field: string, value: string) => {
    onDataUpdate({
      ...projectData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TooltipField
          label="BREEAM"
          tooltip="Select status or the targeted BREEAM rating"
          required={true}
        >
          <Select
            value={projectData["BREEAM"] || ""}
            onValueChange={(value) => handleInputChange("BREEAM", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-targeted">Not targeted</SelectItem>
              <SelectItem value="to-be-determined">To be determined</SelectItem>
              <SelectItem value="outstanding">Outstanding</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="very-good">Very Good</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="unclassified">Unclassified</SelectItem>
            </SelectContent>
          </Select>
        </TooltipField>

        <TooltipField
          label="LEED"
          tooltip="Select status or the targeted LEED rating"
          required={true}
        >
          <Select
            value={projectData["LEED"] || ""}
            onValueChange={(value) => handleInputChange("LEED", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-targeted">Not targeted</SelectItem>
              <SelectItem value="to-be-determined">To be determined</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="certified">Certified</SelectItem>
            </SelectContent>
          </Select>
        </TooltipField>

        <TooltipField
          label="WELL"
          tooltip="Select status or the targeted WELL rating"
          required={true}
        >
          <Select
            value={projectData["WELL"] || ""}
            onValueChange={(value) => handleInputChange("WELL", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-targeted">Not targeted</SelectItem>
              <SelectItem value="to-be-determined">To be determined</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
            </SelectContent>
          </Select>
        </TooltipField>

        <TooltipField
          label="Fitwel"
          tooltip="Select status or the targeted Fitwel rating"
          required={true}
        >
          <Select
            value={projectData["Fitwell"] || ""}
            onValueChange={(value) => handleInputChange("Fitwell", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-targeted">Not targeted</SelectItem>
              <SelectItem value="to-be-determined">To be determined</SelectItem>
              <SelectItem value="3-stars">3 stars</SelectItem>
              <SelectItem value="2-stars">2 stars</SelectItem>
              <SelectItem value="1-star">1 star</SelectItem>
              <SelectItem value="not-certified">Not certified</SelectItem>
            </SelectContent>
          </Select>
        </TooltipField>

        <TooltipField
          label="Passivhaus"
          tooltip="Indicate if targeting Passivhaus"
          required={true}
        >
          <Select
            value={projectData["Passivhaus"] || ""}
            onValueChange={(value) => handleInputChange("Passivhaus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Indicate if targeting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-targeted">Not targeted</SelectItem>
              <SelectItem value="to-be-determined">To be determined</SelectItem>
              <SelectItem value="Passivhaus">Passivhaus</SelectItem>
            </SelectContent>
          </Select>
        </TooltipField>

        <TooltipField
          label="EnerPHit"
          tooltip="Indicate if targeting EnerPHit"
          required={true}
        >
          <Select
            value={projectData["EnerPHit"] || ""}
            onValueChange={(value) => handleInputChange("EnerPHit", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Indicate if targeting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-targeted">Not targeted</SelectItem>
              <SelectItem value="to-be-determined">To be determined</SelectItem>
              <SelectItem value="EnerPHit">EnerPHit</SelectItem>
            </SelectContent>
          </Select>
        </TooltipField>

        <TooltipField
          label="UKNZCBS"
          tooltip="Indicate if targeting UKNZCBS. Ensure the PC year above is correct"
          required={true}
        >
          <Select
            value={projectData["UKNZCBS"] || ""}
            onValueChange={(value) => handleInputChange("UKNZCBS", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Indicate if targeting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-targeted">Not targeted</SelectItem>
              <SelectItem value="to-be-determined">To be determined</SelectItem>
              <SelectItem value="yes-2025">Yes - 2025</SelectItem>
              <SelectItem value="yes-2026">Yes - 2026</SelectItem>
              <SelectItem value="yes-2027">Yes - 2027</SelectItem>
              <SelectItem value="yes-2028">Yes - 2028</SelectItem>
              <SelectItem value="yes-2029">Yes - 2029</SelectItem>
              <SelectItem value="yes-2030">Yes - 2030</SelectItem>
              <SelectItem value="yes-2031">Yes - 2031</SelectItem>
              <SelectItem value="yes-2032">Yes - 2032</SelectItem>
              <SelectItem value="yes-2033">Yes - 2033</SelectItem>
              <SelectItem value="yes-2034">Yes - 2034</SelectItem>
              <SelectItem value="yes-2035">Yes - 2035</SelectItem>
            </SelectContent>
          </Select>
        </TooltipField>

        <TooltipField
          label="NABERS"
          tooltip="Select status or the targeted NABERS rating"
          required={true}
        >
          <Select
            value={projectData["NABERS"] || ""}
            onValueChange={(value) => handleInputChange("NABERS", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-targeted">Not targeted</SelectItem>
              <SelectItem value="to-be-determined">To be determined</SelectItem>
              <SelectItem value="1-star">1 Star</SelectItem>
              <SelectItem value="2-stars">2 Stars</SelectItem>
              <SelectItem value="3-stars">3 Stars</SelectItem>
              <SelectItem value="4-stars">4 Stars</SelectItem>
              <SelectItem value="5-stars">5 Stars</SelectItem>
              <SelectItem value="6-stars">6 Stars</SelectItem>
            </SelectContent>
          </Select>
        </TooltipField>
      </div>

      <TooltipField
        label="Other certification"
        tooltip="Insert name of other certification and target"
      >
        <Input
          placeholder="Add details"
          value={projectData["Other Cerification"] || ""}
          onChange={(e) =>
            handleInputChange("Other certification", e.target.value)
          }
        />
      </TooltipField>
    </div>
  );
};
