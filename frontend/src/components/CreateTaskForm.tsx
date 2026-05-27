import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { categoriesEndpoint } from "@/api/endpoints/categories.endpoint";
import { colors, spacing, fontWeights } from "@/styles/theme.constants";
import type {
  ApiActionResponse,
  Category,
  CreateTodoBody,
  Todo,
} from "@/types/api.types";
import { getErrorMessage } from "@/utils/error.utils";

interface CreateTaskFormProps {
  onCreate: (data: CreateTodoBody) => Promise<ApiActionResponse<Todo>>;
}

export const CreateTaskForm = ({ onCreate }: CreateTaskFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoBody>({
    defaultValues: {
      text: "",
      categoryId: undefined,
    },
  });

  useEffect(() => {
    categoriesEndpoint
      .getAll()
      .then((res) => setCategories(res.list ?? []))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const onSubmit = async (data: CreateTodoBody) => {
    try {
      await onCreate({
        text: data.text,
        categoryId: Number(data.categoryId),
      });
      reset();
    } catch (err) {
      console.error("Failed to create task:", err);

      setError("root.serverError", {
        type: "server",
        message: getErrorMessage(
          err,
          "Failed to create task. Please try again later.",
        ),
      });
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: spacing.md,
        borderRadius: 2,
        backgroundColor: colors.white,
        mb: spacing.lg,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: spacing.md }}
      >
        {errors.root?.serverError && (
          <Typography
            color="error"
            variant="body2"
            sx={{ fontWeight: fontWeights.medium }}
          >
            {errors.root.serverError.message}
          </Typography>
        )}

        <Controller
          name="text"
          control={control}
          rules={{ required: "Task description is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="What needs to be done?"
              variant="outlined"
              fullWidth
              size="small"
              disabled={isSubmitting}
              error={!!errors.text}
              helperText={errors.text?.message}
            />
          )}
        />

        <FormControl
          fullWidth
          size="small"
          error={!!errors.categoryId}
          disabled={isSubmitting}
        >
          <InputLabel id="category-select-label">Category</InputLabel>
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Please select a category" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="category-select-label"
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.categoryId && (
            <FormHelperText>{errors.categoryId.message}</FormHelperText>
          )}
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? null : <AddIcon />}
          sx={{
            fontWeight: fontWeights.semibold,
            textTransform: "none",
            py: 1,
            minHeight: "40px",
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} sx={{ color: colors.white }} />
          ) : (
            "Add Task"
          )}
        </Button>
      </Box>
    </Paper>
  );
};
