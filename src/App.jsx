import { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Login'

// ⚠️ URL ของคุณ
const API_URL = "https://script.google.com/macros/s/AKfycbzLEilHykypkbvv1UvU-B9IdoGT_Nvn6UdB_aHndRgdUD5EwbPSAxPJjSpCqPkVHQVy/exec";

// --- ตั้งค่าความกว้างคอลัมน์ ---
const COLUMN_STYLES = {
  "_category": { width: "200px", minWidth: "200px" },
  "รหัสสินค้า": { width: "100px", minWidth: "100px" },
  "ชื่อสินค้า": { width: "200px", minWidth: "200px" },
  "รายละเอียด": { width: "300px", minWidth: "300px" },
  "ขนาด": { width: "80px", minWidth: "80px" },
  "ราคา": { width: "100px", minWidth: "100px" },
  "ภาพ": { width: "120px", minWidth: "120px" },
  "รูปภาพ": { width: "120px", minWidth: "120px" },
  "รีวิว": { width: "250px", minWidth: "250px" },
  "คุณลักษณะพิเศษ": { width: "200px", minWidth: "200px" },
  "สเปคสินค้า": { width: "200px", minWidth: "200px" },
  "วิธีการใช้งาน": { width: "200px", minWidth: "200px" },
};

// รายการหมวดหมู่ทั้งหมด
const ALL_SHEETS = [
  "หัวน้ำหยด/หัวฉีดสเปรย์/มินิสปริงเกอร์",
  "หัวพ่นหมอก",
  "สปริงเกอร์",
  "ฟุตวาล์ว",
  "เทปน้ำพุ่ง/เทปน้ำหยด",
  "ท่อและข้อต่อ",
  "วาล์วเกษตร",
  "ปั๊มและอะไหล่ปั๊ม",
  "อุปกรณ์สวนในบ้าน",
  "ข้อต่อเกษตร",
  "ท่อส่งน้ำ",
  "อุปกรณ์สุขภัณฑ์",
  "อุปกรณ์การเกษตร",
  "เครื่องมือช่าง",
  "อุปกรณ์PVC",
  "อุปกรณ์พลาสติก",
  "สินค้าชุด SET",
  "อุปกรณ์พ่นยา",
  "รายการสินค้าเข้าใหม่"
];

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // ตรวจสอบจาก localStorage เมื่อ component โหลด
    return localStorage.getItem('isAuthenticated') === 'true'
  });
  
  // User role state
  const [userRole, setUserRole] = useState(() => {
    // ตรวจสอบ role จาก localStorage เมื่อ component โหลด
    return localStorage.getItem('userRole') || 'admin'
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sheetName, setSheetName] = useState("หัวน้ำหยด/หัวฉีดสเปรย์/มินิสปริงเกอร์"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [allData, setAllData] = useState([]); // เก็บข้อมูลจากทุกหมวดหมู่เมื่อค้นหา

  // --- STATE สำหรับการ เพิ่ม/แก้ไข ---
  const [showModal, setShowModal] = useState(false); // ควบคุมการเปิดปิด Modal
  const [formData, setFormData] = useState({});      // เก็บข้อมูลในฟอร์ม
  const [editRowIndex, setEditRowIndex] = useState(null); // เก็บเลขบรรทัดที่จะแก้ (ถ้าเป็น null คือเพิ่มใหม่)

  // 1. ฟังก์ชันดึงข้อมูล
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?sheet=${encodeURIComponent(sheetName)}`);
      setData(response.data);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("โหลดข้อมูลไม่สำเร็จ กรุณาเช็ค URL หรืออินเทอร์เน็ต");
    } finally {
      setLoading(false);
    }
  }, [sheetName]);

  // ฟังก์ชันดึงข้อมูลจากทุกหมวดหมู่
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const promises = ALL_SHEETS.map(async (sheet) => {
        try {
          const response = await axios.get(`${API_URL}?sheet=${encodeURIComponent(sheet)}`);
          // เพิ่มชื่อหมวดหมู่ในแต่ละแถว
          return response.data.map(row => ({ ...row, _category: sheet }));
        } catch (error) {
          console.error(`Error loading ${sheet}:`, error);
          return [];
        }
      });
      
      const results = await Promise.all(promises);
      const combinedData = results.flat();
      setAllData(combinedData);
    } catch (error) {
      console.error("Error loading all data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // เมื่อมีการพิมพ์ในช่องค้นหา ให้ดึงข้อมูลจากทุกหมวดหมู่
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== '') {
      fetchAllData();
    } else {
      setAllData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // 2. ฟังก์ชันแสดงผลเซลล์
  const renderCellContent = (key, value) => {
    if (!value) return "";
    const strValue = value.toString();

    // ก. YouTube
    if (strValue.includes("youtube.com") || strValue.includes("youtu.be")) {
       let videoId = "";
       if (strValue.includes("v=")) videoId = strValue.split("v=")[1].split("&")[0];
       else if (strValue.includes("youtu.be/")) videoId = strValue.split("youtu.be/")[1];
       
       if (videoId) {
         return (
           <div className="ratio ratio-16x9" style={{ width: '130px' }}>
             <iframe src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen title="Video"></iframe>
           </div>
         );
       }
       return <a href={strValue} target="_blank" rel="noreferrer">ดูลิ้งก์</a>;
    }

    // ข. รูปภาพ
    if (key.includes("ภาพ") || key.includes("Image") || key.includes("แบรนด์")) {
        if (strValue.includes("http")) {
            const imgUrl = strValue.replace("file/d/", "uc?export=view&id=").replace("/view?usp=sharing", "");
            return <img src={imgUrl} alt="img" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />;
        }
        return <span className="text-muted small">No Image</span>;
    }

    return strValue;
  };

  // 3. ฟังก์ชันลบ
  const handleDelete = async (rowIndex) => {
    if (!confirm("ยืนยันการลบข้อมูลนี้?")) return;
    const payload = JSON.stringify({ action: "delete", sheetName, rowIndex });
    try {
      setLoading(true);
      await fetch(API_URL, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      });
      alert("ลบเสร็จเรียบร้อย!");
      fetchData(); 
    } catch (error) {
      console.error("Delete error:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
      setLoading(false);
    }
  };

  // --- 4. ฟังก์ชันจัดการ Modal และการบันทึก (ส่วนที่เพิ่มใหม่) ---
  
  // เปิด Modal เพื่อเพิ่มข้อมูลใหม่
  const openAddModal = () => {
    setEditRowIndex(null); // เคลียร์ index เพื่อบอกว่าเป็น "เพิ่มใหม่"
    setFormData({});       // เคลียร์ฟอร์ม
    setShowModal(true);
  };

  // เปิด Modal เพื่อแก้ไขข้อมูล
  const openEditModal = (row) => {
    // ถ้ามีการค้นหา ให้ใช้ sheetName จาก _category
    if (row._category) {
      setSheetName(row._category);
    }
    setEditRowIndex(row.rowIndex); // เก็บ index ที่จะแก้
    const { _category, ...rowData } = row; // ลบ _category ออก
    setFormData(rowData);         // เอาข้อมูลเดิมมาใส่ฟอร์ม
    setShowModal(true);
  };

  // จัดการเมื่อพิมพ์ในช่อง input
  const handleInputChange = (e, key) => {
    setFormData({
      ...formData,
      [key]: e.target.value
    });
  };

  // บันทึกข้อมูล (Save)
  const handleSave = async () => {
    // 1. เตรียมข้อมูลให้เป็น Array ตามลำดับหัวข้อ (เพราะ Google Sheet รับเป็น Array)
    if (data.length === 0) return;
    
    // ดึงหัวข้อทั้งหมดจากข้อมูลแถวแรก (ยกเว้น rowIndex)
    const headers = Object.keys(data[0]).filter(k => k !== 'rowIndex');
    
    // เรียงข้อมูลจาก formData ให้ตรงกับหัวข้อ
    const rowDataArray = headers.map(header => formData[header] || "");

    const action = editRowIndex !== null ? "edit" : "add";

    const payload = JSON.stringify({
      action: action,
      sheetName: sheetName,
      rowIndex: editRowIndex,
      rowData: rowDataArray
    });

    try {
      setLoading(true);
      setShowModal(false); // ปิด Modal ก่อน
      await fetch(API_URL, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      });
      alert(action === "add" ? "เพิ่มข้อมูลเรียบร้อย!" : "แก้ไขข้อมูลเรียบร้อย!");
      fetchData(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("Save error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
      setLoading(false);
    }
  };

  // 5. กรองข้อมูล (Search) - ค้นหาข้ามหมวดหมู่
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      // ถ้าไม่มีการค้นหา แสดงข้อมูลจากหมวดหมู่ที่เลือก
      return data;
    }
    
    // ถ้ามีการค้นหา แต่ยังไม่มีข้อมูลจากทุกหมวดหมู่ ให้ return array ว่าง
    if (allData.length === 0) {
      return [];
    }
    
    // ค้นหาจากข้อมูลทุกหมวดหมู่
    return allData.filter((row) => {
      const rowString = Object.values(row)
        .filter(key => key !== '_category' && key !== 'rowIndex')
        .join(" ")
        .toLowerCase();
      return rowString.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, data, allData]);

  // 6. หาคอลัมน์ที่จะแสดง (ซ่อนคอลัมน์ที่ไม่มีข้อมูล)
  const getVisibleColumns = () => {
    const dataSource = searchTerm && allData.length > 0 ? allData : data;
    if (dataSource.length === 0) return [];
    
    // ตรวจสอบว่าคอลัมน์ไหนมีข้อมูลอย่างน้อย 1 แถว
    const columns = Object.keys(dataSource[0]).filter(key => {
      if (key === "rowIndex" || key === "_category") return false;
      
      // ตรวจสอบว่ามีข้อมูลในคอลัมน์นี้อย่างน้อย 1 แถว
      return dataSource.some(row => {
        const value = row[key];
        return value !== null && value !== undefined && value !== "" && value.toString().trim() !== "";
      });
    });
    
    // ถ้ามีการค้นหา ให้เพิ่มคอลัมน์ "หมวดหมู่" ไว้ด้านหน้า
    if (searchTerm && allData.length > 0) {
      return ["_category", ...columns];
    }
    
    return columns;
  };

  const visibleColumns = getVisibleColumns();

  // ฟังก์ชันจัดการการ login
  const handleLogin = useCallback((success, role = 'admin') => {
    setIsAuthenticated(success);
    setUserRole(role);
    if (success) {
      localStorage.setItem('userRole', role);
    }
  }, []);

  // ฟังก์ชันจัดการการ logout
  const handleLogout = useCallback((autoLogout = false) => {
    if (!autoLogout && !confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      return;
    }
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('lastActivityTime');
    localStorage.removeItem('lastVisibilityChangeTime');
    setIsAuthenticated(false);
    setUserRole('admin');
  }, []);

  // Auto-logout: ตรวจจับเมื่อไม่มีการใช้งาน 10 นาที
  useEffect(() => {
    if (!isAuthenticated) return;

    const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 นาที
    let idleTimer = null;
    let visibilityTimer = null;

    // ฟังก์ชันรีเซ็ต idle timer
    const resetIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      // บันทึกเวลาที่มีการใช้งานล่าสุด
      localStorage.setItem('lastActivityTime', Date.now().toString());
      
      idleTimer = setTimeout(() => {
        alert('คุณไม่ได้ใช้งานระบบเป็นเวลา 10 นาที ระบบจะออกจากระบบอัตโนมัติ');
        handleLogout(true);
      }, IDLE_TIMEOUT);
    };

    // ฟังก์ชันตรวจสอบเมื่อออกจากเว็บ (visibility change)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // บันทึกเวลาที่ tab/window ถูกซ่อน
        localStorage.setItem('lastVisibilityChangeTime', Date.now().toString());
        
        // ตั้ง timer สำหรับตรวจสอบเมื่อกลับมา
        visibilityTimer = setTimeout(() => {
          const lastVisibilityTime = localStorage.getItem('lastVisibilityChangeTime');
          if (lastVisibilityTime) {
            const timeDiff = Date.now() - parseInt(lastVisibilityTime);
            if (timeDiff >= IDLE_TIMEOUT) {
              alert('คุณออกจากเว็บเป็นเวลา 10 นาที ระบบจะออกจากระบบอัตโนมัติ');
              handleLogout(true);
            }
          }
        }, IDLE_TIMEOUT);
      } else {
        // เมื่อกลับมาใช้งาน ให้ตรวจสอบว่าเกิน 10 นาทีหรือไม่
        if (visibilityTimer) {
          clearTimeout(visibilityTimer);
        }
        
        const lastVisibilityTime = localStorage.getItem('lastVisibilityChangeTime');
        if (lastVisibilityTime) {
          const timeDiff = Date.now() - parseInt(lastVisibilityTime);
          if (timeDiff >= IDLE_TIMEOUT) {
            alert('คุณออกจากเว็บเป็นเวลา 10 นาที ระบบจะออกจากระบบอัตโนมัติ');
            handleLogout(true);
            return;
          }
        }
        
        // รีเซ็ต idle timer เมื่อกลับมาใช้งาน
        resetIdleTimer();
      }
    };

    // Event listeners สำหรับตรวจจับ user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetIdleTimer();
    };

    // เพิ่ม event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // เพิ่ม visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ตรวจสอบเมื่อ component mount ว่ามีการ idle หรือออกจากเว็บเกิน 10 นาทีหรือไม่
    const lastVisibilityTime = localStorage.getItem('lastVisibilityChangeTime');
    if (lastVisibilityTime && !document.hidden) {
      // ตรวจสอบว่าออกจากเว็บเกิน 10 นาทีหรือไม่
      const visibilityTimeDiff = Date.now() - parseInt(lastVisibilityTime);
      if (visibilityTimeDiff >= IDLE_TIMEOUT) {
        alert('คุณออกจากเว็บเป็นเวลา 10 นาที ระบบจะออกจากระบบอัตโนมัติ');
        handleLogout(true);
        return;
      }
      // ลบ lastVisibilityChangeTime เพราะกลับมาใช้งานแล้ว
      localStorage.removeItem('lastVisibilityChangeTime');
    }

    const lastActivityTime = localStorage.getItem('lastActivityTime');
    if (lastActivityTime) {
      const timeDiff = Date.now() - parseInt(lastActivityTime);
      if (timeDiff >= IDLE_TIMEOUT) {
        alert('คุณไม่ได้ใช้งานระบบเป็นเวลา 10 นาที ระบบจะออกจากระบบอัตโนมัติ');
        handleLogout(true);
        return;
      } else {
        // ตั้ง timer ตามเวลาที่เหลือ
        const remainingTime = IDLE_TIMEOUT - timeDiff;
        idleTimer = setTimeout(() => {
          alert('คุณไม่ได้ใช้งานระบบเป็นเวลา 10 นาที ระบบจะออกจากระบบอัตโนมัติ');
          handleLogout(true);
        }, remainingTime);
      }
    } else {
      // ถ้ายังไม่มี lastActivityTime ให้เริ่มต้นใหม่
      resetIdleTimer();
    }

    // Cleanup
    return () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      if (visibilityTimer) {
        clearTimeout(visibilityTimer);
      }
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, handleLogout]);

  // ถ้ายังไม่ได้ login แสดงหน้า login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container-fluid p-3" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', overflowY: 'hidden', maxWidth: '100vw', boxSizing: 'border-box', width: '100vw' }}>
      <div style={{ flexShrink: 0, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        <div className="d-flex justify-content-between align-items-center mb-3" style={{ width: '100%', maxWidth: '100%' }}>
          <h2 className="text-primary fw-bold">ระบบจัดการสินค้า</h2>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success">Online</span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              🚪 ออกจากระบบ
            </button>
          </div>
        </div>
        
        {/* แผงควบคุม */}
        <div className="card p-3 mb-3 shadow-sm border-0 bg-light">
          <div className="row g-3">
            {/* เลือกหมวดหมู่ */}
            <div className="col-md-4">
              <label className="form-label fw-bold">หมวดหมู่สินค้า:</label>
              <select className="form-select" value={sheetName} onChange={(e) => setSheetName(e.target.value)}>
              <option value="หัวน้ำหยด/หัวฉีดสเปรย์/มินิสปริงเกอร์">หัวน้ำหยด/หัวฉีดสเปรย์/มินิสปริงเกอร์</option>
              <option value="หัวพ่นหมอก">หัวพ่นหมอก</option>
              <option value="สปริงเกอร์">สปริงเกอร์</option>
              <option value="ฟุตวาล์ว">ฟุตวาล์ว</option>
              <option value="เทปน้ำพุ่ง/เทปน้ำหยด">เทปน้ำพุ่ง/เทปน้ำหยด</option>
              <option value="ท่อและข้อต่อ">ท่อและข้อต่อ</option>
              <option value="วาล์วเกษตร">วาล์วเกษตร</option>
              <option value="ปั๊มและอะไหล่ปั๊ม">ปั๊มและอะไหล่ปั๊ม</option>
              <option value="อุปกรณ์สวนในบ้าน">อุปกรณ์สวนในบ้าน</option>
              <option value="ข้อต่อเกษตร">ข้อต่อเกษตร</option>
              <option value="ท่อส่งน้ำ">ท่อส่งน้ำ</option>
              <option value="อุปกรณ์สุขภัณฑ์">อุปกรณ์สุขภัณฑ์</option>
              <option value="อุปกรณ์การเกษตร">อุปกรณ์การเกษตร</option>
              <option value="เครื่องมือช่าง">เครื่องมือช่าง</option>
              <option value="อุปกรณ์PVC">อุปกรณ์PVC</option>
              <option value="อุปกรณ์พลาสติก">อุปกรณ์พลาสติก</option>
              <option value="สินค้าชุด SET">สินค้าชุด SET</option>
              <option value="อุปกรณ์พ่นยา">อุปกรณ์พ่นยา</option>
              <option value="รายการสินค้าเข้าใหม่">รายการสินค้าเข้าใหม่</option>
              </select>
            </div>

            {/* ช่องค้นหา */}
            <div className="col-md-4">
              <label className="form-label fw-bold">ค้นหา:</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search">🔍</i></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="พิมพ์คำค้นหา..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* ปุ่มกด Action */}
            <div className="col-md-4 d-flex align-items-end gap-2">
              <button className="btn btn-primary flex-fill" onClick={fetchData} disabled={loading}>
                 {loading ? '...' : '🔄 รีเฟรช'}
              </button>
              {/* ปุ่มเพิ่มสินค้าใหม่ - แสดงเฉพาะ admin */}
              {userRole === 'admin' && (
                <button className="btn btn-success flex-fill" onClick={openAddModal} disabled={loading}>
                   ➕ เพิ่มสินค้า
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ตารางแสดงผล */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">กำลังดึงข้อมูล...</p>
        </div>
      ) : (
        <div className="text-center shadow rounded" style={{ flex: 1, height: 0, overflow: 'auto', width: '100%' }}>
          <table className="table table-hover table-bordered mb-0 bg-white align-middle" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead className="table-primary" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {visibleColumns.map((key) => (
                  <th key={key} className="py-3 text-nowrap" style={COLUMN_STYLES[key] || { width: '150px', minWidth: '150px' }}>
                    {key === '_category' ? 'หมวดหมู่' : key}
                  </th>
                ))}
                {/* คอลัมน์จัดการ - แสดงเฉพาะ admin */}
                {userRole === 'admin' && (
                  <th style={{width: '120px', minWidth: '120px', textAlign: 'center', backgroundColor: '#cfe2ff'}}>จัดการ</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan={visibleColumns.length + (userRole === 'admin' ? 1 : 0)} className="text-center p-5 text-muted">ไม่พบข้อมูล</td></tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr key={index}>
                    {visibleColumns.map((key) => (
                      <td key={key} style={COLUMN_STYLES[key] || { width: '150px', minWidth: '150px' }}>
                        {key === '_category' ? row._category : renderCellContent(key, row[key])}
                      </td>
                    ))}
                    {/* คอลัมน์จัดการ - แสดงเฉพาะ admin */}
                    {userRole === 'admin' && (
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          {/* ปุ่มแก้ไข */}
                          <button className="btn btn-warning btn-sm" onClick={() => openEditModal(row)}>✏️</button>
                          {/* ปุ่มลบ */}
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(row.rowIndex, row._category)}>🗑️</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal ฟอร์ม เพิ่ม/แก้ไข ข้อมูล */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{editRowIndex !== null ? 'แก้ไขข้อมูล' : 'เพิ่มสินค้าใหม่'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  {visibleColumns.map((key) => (
                    <div className="mb-3" key={key}>
                      <label className="form-label fw-bold">{key}</label>
                      {/* ถ้าเป็นสเปคหรือรายละเอียด ใช้ textarea */}
                      {key.includes("สเปค") || key.includes("รายละเอียด") || key.includes("วิธี") || key.includes("คำแนะนำ") || key.includes("คุณลักษณะ") ? (
                        <textarea 
                          className="form-control" 
                          rows="3"
                          value={formData[key] || ""}
                          onChange={(e) => handleInputChange(e, key)}
                        ></textarea>
                      ) : (
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData[key] || ""}
                          onChange={(e) => handleInputChange(e, key)}
                          placeholder={key.includes("ภาพ") ? "วางลิงก์รูปภาพ..." : ""}
                        />
                      )}
                    </div>
                  ))}
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>ยกเลิก</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>บันทึก</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App