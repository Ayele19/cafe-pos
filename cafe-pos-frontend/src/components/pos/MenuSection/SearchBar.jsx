import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = () => {
  return (
    <TextField
      fullWidth
      placeholder="Search products..."
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );
};

export default SearchBar;
