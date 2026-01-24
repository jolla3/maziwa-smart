// const fetchListings = useCallback(async () => {
//     setLoading(true);
//     try {
//       const result = await mockAPI.fetchListings(filters);
//       if (result.success) {
//         setListings(result.listings);
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchListings();
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, [fetchListings]);

//   return { listings, loading, filters, setFilters };
// };