export interface IVehicleInfoFilterRequest {
    searchTerm?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleColor?: string;
    vehicleLicensePlateNumber?: string;
    // Add more fields as necessary
  }
  
  export interface IPaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  