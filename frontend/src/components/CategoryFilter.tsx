import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { Category } from "@/types/api.types";
import type { FilterCategoryValue } from "@/types/common.types";

interface CategoryFilterProps {
  value: FilterCategoryValue;
  onChange: (value: FilterCategoryValue) => void;
  categories: Category[];
}

export const CategoryFilter = ({
  value,
  onChange,
  categories,
}: CategoryFilterProps) => {
  return (
    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
      <InputLabel id="filter-category-label">Filter by Category</InputLabel>
      <Select
        labelId="filter-category-label"
        value={value}
        label="Filter by Category"
        onChange={(e) => onChange(e.target.value as FilterCategoryValue)}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
