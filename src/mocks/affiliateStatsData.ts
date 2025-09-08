import type { AffiliateDashboardStats } from '@/schemas/affiliate.schemas'

export const mockAffiliateStatsData: AffiliateDashboardStats = {
  overview: {
    totalAffiliates: 156,
    totalBookings: 2847,
    totalRevenue: 2847000000, // 2.847 tỷ VND
    totalCommission: 284700000, // 284.7 triệu VND
    activeAffiliates: 89,
    topAffiliates: [
      {
        id: 1,
        affiliate_code: 'AFF001',
        affiliate_name: 'Nguyễn Văn An',
        totalBookings: 245,
        totalRevenue: 245000000,
        commission: 24500000,
      },
      {
        id: 2,
        affiliate_code: 'AFF002',
        affiliate_name: 'Trần Thị Bình',
        totalBookings: 198,
        totalRevenue: 198000000,
        commission: 19800000,
      },
      {
        id: 3,
        affiliate_code: 'AFF003',
        affiliate_name: 'Lê Văn Cường',
        totalBookings: 167,
        totalRevenue: 167000000,
        commission: 16700000,
      },
      {
        id: 4,
        affiliate_code: 'AFF004',
        affiliate_name: 'Phạm Thị Dung',
        totalBookings: 143,
        totalRevenue: 143000000,
        commission: 14300000,
      },
      {
        id: 5,
        affiliate_code: 'AFF005',
        affiliate_name: 'Hoàng Văn Em',
        totalBookings: 132,
        totalRevenue: 132000000,
        commission: 13200000,
      },
    ],
    monthlyStats: [
      {
        month: '2024-01',
        totalBookings: 234,
        totalRevenue: 234000000,
        newAffiliates: 12,
      },
      {
        month: '2024-02',
        totalBookings: 267,
        totalRevenue: 267000000,
        newAffiliates: 8,
      },
      {
        month: '2024-03',
        totalBookings: 298,
        totalRevenue: 298000000,
        newAffiliates: 15,
      },
      {
        month: '2024-04',
        totalBookings: 312,
        totalRevenue: 312000000,
        newAffiliates: 11,
      },
      {
        month: '2024-05',
        totalBookings: 345,
        totalRevenue: 345000000,
        newAffiliates: 18,
      },
      {
        month: '2024-06',
        totalBookings: 378,
        totalRevenue: 378000000,
        newAffiliates: 14,
      },
      {
        month: '2024-07',
        totalBookings: 401,
        totalRevenue: 401000000,
        newAffiliates: 16,
      },
      {
        month: '2024-08',
        totalBookings: 423,
        totalRevenue: 423000000,
        newAffiliates: 13,
      },
      {
        month: '2024-09',
        totalBookings: 389,
        totalRevenue: 389000000,
        newAffiliates: 9,
      },
      {
        month: '2024-10',
        totalBookings: 456,
        totalRevenue: 456000000,
        newAffiliates: 22,
      },
      {
        month: '2024-11',
        totalBookings: 478,
        totalRevenue: 478000000,
        newAffiliates: 19,
      },
      {
        month: '2024-12',
        totalBookings: 512,
        totalRevenue: 512000000,
        newAffiliates: 25,
      },
    ],
    bookingStatusStats: [
      {
        status: 'COMPLETED',
        count: 1847,
        percentage: 64.9,
      },
      {
        status: 'CANCELLED',
        count: 456,
        percentage: 16.0,
      },
      {
        status: 'PENDING',
        count: 234,
        percentage: 8.2,
      },
      {
        status: 'CONFIRMED',
        count: 198,
        percentage: 7.0,
      },
      {
        status: 'DRAFT',
        count: 112,
        percentage: 3.9,
      },
    ],
    cityStats: [
      {
        city: 'Hồ Chí Minh',
        affiliateCount: 45,
        bookingCount: 1245,
        revenue: 1245000000,
      },
      {
        city: 'Hà Nội',
        affiliateCount: 38,
        bookingCount: 987,
        revenue: 987000000,
      },
      {
        city: 'Đà Nẵng',
        affiliateCount: 22,
        bookingCount: 345,
        revenue: 345000000,
      },
      {
        city: 'Cần Thơ',
        affiliateCount: 18,
        bookingCount: 156,
        revenue: 156000000,
      },
      {
        city: 'Hải Phòng',
        affiliateCount: 15,
        bookingCount: 114,
        revenue: 114000000,
      },
    ],
  },
  period: {
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
  },
}
