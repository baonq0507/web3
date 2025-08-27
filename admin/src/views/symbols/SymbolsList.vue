<template>
  <div class="symbols-list">
    <div class="header">
      <h1>Quản lý Symbols</h1>
      <a-button @click="showCreateModal = true" type="primary">
        <template #icon><PlusOutlined /></template>
        Thêm Symbol
      </a-button>
    </div>

    <!-- Search và Filter -->
    <div class="filters">
      <div class="search-box">
        <a-input
          v-model:value="filters.search"
          placeholder="Tìm kiếm theo tên hoặc code..."
          @input="handleSearch"
          size="large"
        >
          <template #suffix><SearchOutlined /></template>
        </a-input>
      </div>
      
      <div class="filter-options">
        <a-select 
          v-model:value="filters.isActive" 
          @change="handleFilter"
          placeholder="Trạng thái"
          style="width: 150px"
        >
          <a-select-option value="">Tất cả trạng thái</a-select-option>
          <a-select-option value="true">Đang hoạt động</a-select-option>
          <a-select-option value="false">Không hoạt động</a-select-option>
        </a-select>
        
        <a-select 
          v-model:value="filters.sortBy" 
          @change="handleFilter"
          placeholder="Sắp xếp theo"
          style="width: 180px"
        >
          <a-select-option value="sortOrder">Thứ tự</a-select-option>
          <a-select-option value="name">Tên</a-select-option>
          <a-select-option value="code">Code</a-select-option>
          <a-select-option value="createdAt">Ngày tạo</a-select-option>
        </a-select>
        
        <a-button @click="toggleSortOrder" class="btn-sort">
          <template #icon>
            <SortAscendingOutlined v-if="filters.sortOrder === 'asc'" />
            <SortDescendingOutlined v-else />
          </template>
        </a-button>
      </div>
    </div>

        <!-- Table -->
    <div class="table-container">
      <a-table
        v-if="safeSymbols.length > 0 || loading"
        :columns="columns"
        :data-source="symbols"
        :loading="loading"
        :pagination="false"
        :row-key="(record: any) => record._id"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <img :src="(record as Symbol).image" :alt="(record as Symbol).name" class="symbol-image" />
          </template>
          
          <template v-else-if="column.key === 'code'">
            <a-tag>{{ (record as Symbol).code }}</a-tag>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-tag :color="(record as Symbol).isActive ? 'green' : 'red'">
              {{ (record as Symbol).isActive ? 'Hoạt động' : 'Không hoạt động' }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate((record as Symbol).createdAt) }}
          </template>
          
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button 
                @click="editSymbol(record as Symbol)" 
                type="primary" 
                size="small"
                ghost
              >
                <template #icon><EditOutlined /></template>
              </a-button>
              <a-button 
                @click="deleteSymbol((record as Symbol)._id)" 
                type="primary" 
                size="small"
                danger
                ghost
              >
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
      
      <!-- Empty state -->
      <div v-if="!loading && safeSymbols.length === 0" class="empty-state">
        <a-empty description="Không có symbols nào" />
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="total > 0 && !loading">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="filters.limit"
        :total="total"
        :page-size-options="['10', '20', '50', '100']"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :show-total="(total: number, range: [number, number]) => `Hiển thị ${range[0]}-${range[1]} / ${total} symbols`"
        @change="changePage"
        @show-size-change="handlePageSizeChange"
        size="default"
        class="custom-pagination"
      />
    </div>

    <!-- Create/Edit Modal -->
    <SymbolModal
      v-if="showCreateModal || showEditModal"
      :symbol="editingSymbol"
      :is-edit="showEditModal"
      @close="closeModal"
      @saved="handleSymbolSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { symbolsApi, type Symbol, type CreateSymbolDto } from '@/api/symbols';
import SymbolModal from './SymbolModal.vue';
import {
  PlusOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';

// State
const symbols = ref<Symbol[]>([]);
const loading = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingSymbol = ref<Symbol | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);

const filters = reactive({
  search: '',
  isActive: '' as string,
  sortBy: 'sortOrder',
  sortOrder: 'asc' as 'asc' | 'desc',
  limit: 10
});

// Table columns configuration
const columns = [
  {
    title: 'Ảnh',
    key: 'image',
    width: 80,
    align: 'center' as const
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    sorter: true
  },
  {
    title: 'Code',
    key: 'code',
    width: 120,
    align: 'center' as const
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 150,
    align: 'center' as const
  },
  {
    title: 'Thứ tự',
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    width: 100,
    align: 'center' as const,
    sorter: true
  },
  {
    title: 'Ngày tạo',
    key: 'createdAt',
    width: 120,
    align: 'center' as const,
    sorter: true
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 120,
    align: 'center' as const,
    fixed: 'right' as const
  }
];

// Đảm bảo symbols luôn là một mảng để tránh lỗi a-table
const safeSymbols = computed(() => {
  return Array.isArray(symbols.value) ? symbols.value : [];
});

// Methods
const loadSymbols = async () => {
  loading.value = true;
  try {
    const response = await symbolsApi.getSymbols({
      page: currentPage.value,
      limit: filters.limit,
      search: filters.search || undefined,
      isActive: filters.isActive === 'true' ? true : filters.isActive === 'false' ? false : undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    });
    
    console.log('Response received:', response);
    console.log('Response type:', typeof response);
    console.log('Response keys:', Object.keys(response));
    
    // Đảm bảo response.data là một mảng
    if (Array.isArray(response.data)) {
      symbols.value = response.data;
    } else if (response.data && typeof response.data === 'object') {
      // Nếu response.data là object, thử lấy mảng từ các thuộc tính có thể có
      const dataArray = (response.data as any).symbols || (response.data as any).items || (response.data as any).list || [];
      symbols.value = Array.isArray(dataArray) ? dataArray : [];
    } else {
      symbols.value = [];
    }
    
    total.value = response.total || 0;
    totalPages.value = response.totalPages || 1;
  } catch (error) {
    console.error('Error loading symbols:', error);
    console.error('Error response:', (error as any).response);
    console.error('Error data:', (error as any).response?.data);
    // Có thể thêm thông báo lỗi ở đây
  } finally {
    loading.value = false;
  }

  console.log(symbols.value);
};

const handleSearch = () => {
  currentPage.value = 1;
  loadSymbols();
};

const handleFilter = () => {
  currentPage.value = 1;
  loadSymbols();
};

const toggleSortOrder = () => {
  filters.sortOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
  loadSymbols();
};

const changePage = (page: number) => {
  currentPage.value = page;
  loadSymbols();
};

const handlePageSizeChange = (current: number, size: number) => {
  filters.limit = size;
  currentPage.value = 1;
  loadSymbols();
};

const editSymbol = (symbol: Symbol) => {
  editingSymbol.value = symbol;
  showEditModal.value = true;
};

const deleteSymbol = async (id: string) => {
  if (!confirm('Bạn có chắc chắn muốn xóa symbol này?')) {
    return;
  }
  
  try {
    await symbolsApi.deleteSymbol(id);
    await loadSymbols();
    // Có thể thêm thông báo thành công ở đây
  } catch (error) {
    console.error('Error deleting symbol:', error);
    // Có thể thêm thông báo lỗi ở đây
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingSymbol.value = null;
};

const handleSymbolSaved = () => {
  closeModal();
  loadSymbols();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

// Lifecycle
onMounted(() => {
  loadSymbols();
});
</script>

<style scoped>
.symbols-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #333;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.filter-options {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-sort {
  background: #f8f9fa;
  border: 1px solid #ddd;
}

.btn-sort:hover {
  background: #e9ecef;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.symbol-image {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.custom-pagination {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.custom-pagination .ant-pagination-total-text {
  color: #666;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-options {
    flex-wrap: wrap;
  }
}
</style>
