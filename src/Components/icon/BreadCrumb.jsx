import React from 'react';
import { 
  Breadcrumbs, 
  Typography, 
  Link, 
  Paper
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

const BreadcrumbComponent = () => {
  const router = useRouter();
  
  // Get the current path and split it into segments
  const pathSegments = router.asPath.split('/').filter(segment => segment);
  
  // Function to generate breadcrumb items
  const getBreadcrumbs = () => {
    // Start with Home
    const breadcrumbs = [
      { label: 'Home', path: '/' }
    ];
    
    // Build up path as we go
    let currentPath = '';
    
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      // Format the label (capitalize first letter, replace hyphens with spaces)
      const label = segment.charAt(0).toUpperCase() + 
                   segment.slice(1).replace(/-/g, ' ');
      
      breadcrumbs.push({
        label,
        path: currentPath
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: 'transparent' }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return isLast ? (
            // Current page (not clickable)
            <Typography color="text.primary" key={index}>
              {breadcrumb.label}
            </Typography>
          ) : (
            // Links to previous pages
            <NextLink href={breadcrumb.path} passHref key={index}>
              <Link 
                underline="hover"
                color="inherit"
              >
                {breadcrumb.label}
              </Link>
            </NextLink>
          );
        })}
      </Breadcrumbs>
    </Paper>
  );
};

export default BreadcrumbComponent;