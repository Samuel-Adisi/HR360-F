import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


const EmployeeDataScreen = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Samuel Adisi',
      email: 'sarah.j@company.com',
      phone: '+1 555-0101',
      position: 'CEO',
      department: 'Executive',
      hireDate: '2018-01-15',
      managerId: null,
      jobHistory: [
        { position: 'CEO', department: 'Executive', startDate: '2020-01-01', endDate: null },
        { position: 'COO', department: 'Operations', startDate: '2018-01-15', endDate: '2019-12-31' }
      ]
    },
    {
      id: 2,
      name: 'Michael Obeng',
      email: 'michael.c@company.com',
      phone: '+1 555-0102',
      position: 'CTO',
      department: 'Technology',
      hireDate: '2019-03-20',
      managerId: 1,
      jobHistory: [
        { position: 'CTO', department: 'Technology', startDate: '2021-06-01', endDate: null },
        { position: 'Engineering Manager', department: 'Technology', startDate: '2019-03-20', endDate: '2021-05-31' }
      ]
    },
    {
      id: 3,
      name: 'Emily Anani',
      email: 'emily.r@company.com',
      phone: '+1 555-0103',
      position: 'Head of HR',
      department: 'Human Resources',
      hireDate: '2019-06-10',
      managerId: 1,
      jobHistory: [
        { position: 'Head of HR', department: 'Human Resources', startDate: '2019-06-10', endDate: null }
      ]
    },
    {
      id: 4,
      name: 'David Yaw',
      email: 'david.k@company.com',
      phone: '+1 555-0104',
      position: 'Senior Developer',
      department: 'Technology',
      hireDate: '2020-02-14',
      managerId: 2,
      jobHistory: [
        { position: 'Senior Developer', department: 'Technology', startDate: '2022-01-01', endDate: null },
        { position: 'Developer', department: 'Technology', startDate: '2020-02-14', endDate: '2021-12-31' }
      ]
    }
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hireDate: '',
    managerId: ''
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.position) {
      const employee = {
        id: employees.length + 1,
        ...newEmployee,
        managerId: newEmployee.managerId ? parseInt(newEmployee.managerId) : null,
        jobHistory: [{
          position: newEmployee.position,
          department: newEmployee.department,
          startDate: newEmployee.hireDate,
          endDate: null
        }]
      };
      setEmployees([...employees, employee]);
      setNewEmployee({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        hireDate: '',
        managerId: ''
      });
      setShowAddModal(false);
    }
  };

  const toggleNode = (id) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const buildOrgTree = () => {
    const tree = {};
    employees.forEach(emp => {
      if (!tree[emp.managerId]) tree[emp.managerId] = [];
      tree[emp.managerId].push(emp);
    });
    return tree;
  };

  const renderOrgNode = (employee, tree, level = 0) => {
    const hasChildren = tree[employee.id] && tree[employee.id].length > 0;
    const isExpanded = expandedNodes[employee.id];

    return (
      <View key={employee.id} style={styles.orgNodeContainer}>
        <View style={[styles.orgNode, { marginLeft: level * 20 }]}>
          <TouchableOpacity
            style={styles.orgNodeContent}
            onPress={() => hasChildren && toggleNode(employee.id)}
          >
            {hasChildren && (
              <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
            )}
            <View style={styles.orgNodeInfo}>
              <Text style={styles.orgNodeName}>{employee.name}</Text>
              <Text style={styles.orgNodePosition}>{employee.position}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {hasChildren && isExpanded && tree[employee.id].map(child =>
          renderOrgNode(child, tree, level + 1)
        )}
      </View>
    );
  };

  const renderEmployeeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.employeeCard}
      onPress={() => setSelectedEmployee(item)}
    >
      <View style={styles.employeeHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.name}</Text>
          <Text style={styles.employeePosition}>{item.position}</Text>
        </View>
      </View>
      <View style={styles.employeeDetails}>
        <Text style={styles.detailText}>📧 {item.email}</Text>
        <Text style={styles.detailText}>📱 {item.phone}</Text>
        <Text style={styles.detailText}>🏢 {item.department}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;

    return (
      <Modal
        visible={!!selectedEmployee}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Employee Details</Text>
              <TouchableOpacity onPress={() => setSelectedEmployee(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <Text style={styles.detailLabel}>Name: {selectedEmployee.name}</Text>
                <Text style={styles.detailLabel}>Email: {selectedEmployee.email}</Text>
                <Text style={styles.detailLabel}>Phone: {selectedEmployee.phone}</Text>
                <Text style={styles.detailLabel}>Hire Date: {selectedEmployee.hireDate}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Current Position</Text>
                <Text style={styles.detailLabel}>Position: {selectedEmployee.position}</Text>
                <Text style={styles.detailLabel}>Department: {selectedEmployee.department}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Job History</Text>
                {selectedEmployee.jobHistory.map((job, idx) => (
                  <View key={idx} style={styles.jobHistoryItem}>
                    <Text style={styles.jobTitle}>{job.position}</Text>
                    <Text style={styles.jobDepartment}>{job.department}</Text>
                    <Text style={styles.jobDates}>
                      {job.startDate} - {job.endDate || 'Present'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderAddEmployeeModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Employee</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={newEmployee.name}
              onChangeText={(text) => setNewEmployee({...newEmployee, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newEmployee.email}
              onChangeText={(text) => setNewEmployee({...newEmployee, email: text})}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newEmployee.phone}
              onChangeText={(text) => setNewEmployee({...newEmployee, phone: text})}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Position"
              value={newEmployee.position}
              onChangeText={(text) => setNewEmployee({...newEmployee, position: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Department"
              value={newEmployee.department}
              onChangeText={(text) => setNewEmployee({...newEmployee, department: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Hire Date (YYYY-MM-DD)"
              value={newEmployee.hireDate}
              onChangeText={(text) => setNewEmployee({...newEmployee, hireDate: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Manager ID (optional)"
              value={newEmployee.managerId}
              onChangeText={(text) => setNewEmployee({...newEmployee, managerId: text})}
              keyboardType="numeric"
            />
            
            <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
              <Text style={styles.addButtonText}>Add Employee</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const tree = buildOrgTree();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Employee Management</Text>
        <TouchableOpacity
          style={styles.addIconButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'employees' && styles.activeTab]}
          onPress={() => setActiveTab('employees')}
        >
          <Text style={[styles.tabText, activeTab === 'employees' && styles.activeTabText]}>
            Employees
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orgChart' && styles.activeTab]}
          onPress={() => setActiveTab('orgChart')}
        >
          <Text style={[styles.tabText, activeTab === 'orgChart' && styles.activeTabText]}>
            Org Chart
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'employees' ? (
        <FlatList
          data={employees}
          renderItem={renderEmployeeCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <ScrollView style={styles.orgChartContainer}>
          <Text style={styles.orgChartTitle}>Organization Chart</Text>
          {tree[null] && tree[null].map(emp => renderOrgNode(emp, tree))}
        </ScrollView>
      )}

      {renderEmployeeDetails()}
      {renderAddEmployeeModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  employeePosition: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  employeeDetails: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  orgChartContainer: {
    flex: 1,
    padding: 16,
  },
  orgChartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  orgNodeContainer: {
    marginBottom: 8,
  },
  orgNode: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 4,
  },
  orgNodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  expandIcon: {
    fontSize: 12,
    marginRight: 8,
    color: '#666',
  },
  orgNodeInfo: {
    flex: 1,
  },
  orgNodeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orgNodePosition: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  jobHistoryItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  jobDepartment: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  jobDates: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});



export default EmployeeDataScreen;