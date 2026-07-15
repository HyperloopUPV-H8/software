import {
  Checkbox,
  Field,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components";
import type { CommandParameter, ParameterValues } from "../../../types/catalog";

interface OrderParametersProps {
  fields: Record<string, CommandParameter>;
  values: ParameterValues;
  onChange: (key: string, value: string | number | boolean) => void;
}

/** Compact parameter form for orders that take fields (e.g. Propulsion Parameterized). */
const OrderParameters = ({ fields, values, onChange }: OrderParametersProps) => (
  <div className="flex flex-col gap-3">
    {Object.entries(fields).map(([key, param]) => (
      <Field key={key}>
        <FieldLabel htmlFor={`param-${key}`}>{param.name}</FieldLabel>
        {param.kind === "numeric" && (
          <Input
            id={`param-${key}`}
            type="number"
            value={String(values[key] ?? "")}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={
              param.safeRange[0] != null && param.safeRange[1] != null
                ? `${param.safeRange[0]}–${param.safeRange[1]}`
                : undefined
            }
          />
        )}
        {param.kind === "enum" && (
          <Select value={String(values[key] ?? "")} onValueChange={(v) => onChange(key, v)}>
            <SelectTrigger id={`param-${key}`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {param.options.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {param.kind === "boolean" && (
          <Checkbox
            id={`param-${key}`}
            checked={Boolean(values[key])}
            onCheckedChange={(checked) => onChange(key, checked === true)}
          />
        )}
      </Field>
    ))}
  </div>
);

export default OrderParameters;
