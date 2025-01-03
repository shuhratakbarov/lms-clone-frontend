import React, {Fragment} from "react";
import {Component} from "react";
import {Button, Select, Space, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, EyeOutlined, UserAddOutlined} from "@ant-design/icons";
import CreateStudentModal from "./createTeacher";
import UpdateStudentModal from "./updateTeacher";
import DeleteStudentModal from "./deleteTeacher";
import ViewGroupsOfTeacher from "./ViewGroupsOfTeacher";
import {serverURL} from "../../../server/serverConsts";
import Search from "antd/es/input/Search";
import {getToken} from "../../../util/TokenUtil";
import {formatDate} from "../../../const/FormatDate";

class ReadTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalPages: 0,
            isActive: "true",
            page: 0,
            size: 10,
            searchText: '',
            isAddModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            isViewGroupsModalVisible: false,
            record: {},
            deleteId: '',
            deleteName: "student",
            viewGroupsId: '',
            studentName: "student",
        };
    }

    hideModal = () => {
        this.setState({
            isAddModalVisible: false,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            isViewGroupsModalVisible: false,
        })
    };

    onSearch = (searchText) => {
        this.setState({
            searchText: searchText,
            page: 0,
        }, () => this.getData())
    }
    handlePagination = (e) => {
        this.setState({
            page: e - 1
        }, () => this.getData())
    }

    getData() {
        const {isActive, page, size, searchText} = this.state;
        axios({
            url: searchText ? `${serverURL}admin/search/2?activity=${isActive}&searching=${searchText}&page=${page}&size=${size}`
                : `${serverURL}admin/list/2?activity=${isActive}&page=${page}&size=${size}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
            .then((res) => {
                let dto = res.data;
                if (dto.success) {
                    console.log(dto.data.content);
                    this.setState({
                        dataSource: dto.data.content.content,
                    });
                } else {
                    alert(dto.message)
                }
            })
            .catch((err) => {
                alert("Noto'g'ri so'rov");
                console.log(err);
            });
    }

    componentDidMount() {
        this.getData();
    }

    handleSuccess = () => {
        this.getData();
    };
    handleAdd = () => {
        this.setState({
            isAddModalVisible: true,
        });
    };

    handleEdit = (record) => {
        this.setState({
            isEditModalVisible: true,
            record: record,
        });
    };

    handleDelete = (id, firstName) => {
        this.setState({
            isDeleteModalVisible: true,
            deleteId: id,
            deleteName: firstName,
        });
    };
    handleViewGroup = (id, name) => {
        this.setState({
            isViewGroupsModalVisible: true,
            studentName: name,
            viewGroupsId: id,
        });

    }
    handleIsActive = (isActive) => {
        document.getElementById("search").innerText = '';
            this.setState({
                isActive: isActive,
                searchText: '',
            }, () => {
                this.getData()
            });
    }

    render() {
        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                key: 'index',
                render: (text, record, index) => index + 1,
            },
            {
                title: 'First name',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Last name',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: 'Phone number',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Birth date',
                dataIndex: 'birthDate',
                key: 'birthDate',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: 'Added at',
                dataIndex: 'createAt',
                key: 'createAt',
                render: createAt => formatDate(createAt),
            },
            {
                title: 'Edited at',
                dataIndex: 'updateAt',
                key: 'updateAt',
                render: updateAt => formatDate(updateAt),
            },
            {
                title: 'Action',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <a onClick={() => this.handleViewGroup(record.id, record.firstName)}><EyeOutlined/></a>
                        <a onClick={() => this.handleEdit(record)}><EditOutlined/></a>
                        <a onClick={() => this.handleDelete(record.id, record.firstName)}><DeleteOutlined/></a>
                    </Space>
                ),
            },
        ];

        const {
            dataSource,
            isAddModalVisible,
            isEditModalVisible,
            isDeleteModalVisible,
            isViewGroupsModalVisible
        } = this.state;
        return (
            <Fragment>
                <div style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                    <h2>Teachers</h2>
                    <div style={{display: "flex"}}>
                        <div style={{width: '400px', float: "right", marginTop: '15px', marginRight: '1vh'}}>
                            <Select onChange={(value) => {
                                this.handleIsActive(value)
                            }} defaultValue={"Active"} style={{width: "20vh", float: "right"}}>
                                <Select.Option value={"true"}>Active</Select.Option>
                                <Select.Option value={"false"}>Not active</Select.Option>
                                <Select.Option value={"all"}>All</Select.Option>
                            </Select>
                        </div>
                        <div style={{width: '400px', float: "right", marginTop: '15px'}}>
                            <Search placeholder={"Qidiruv..."} id={"search"} onSearch={(value) => this.onSearch(value)}/>
                        </div>
                    </div>
                </div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                        pageSize: this.state.size,
                        total: this.state.totalPages,
                        onChange: this.handlePagination,
                    }}
                >
                </Table>
                <Button type="primary" onClick={this.handleAdd} icon={<UserAddOutlined/>}>
                    New Teacher
                </Button>
                {isAddModalVisible && (<CreateStudentModal
                    isAddModalVisible={isAddModalVisible}
                    onSuccess={this.handleSuccess}
                    onCancel={this.hideModal}
                    onClose={this.hideModal}
                />)}
                {isEditModalVisible && (<UpdateStudentModal
                    isEditModalVisible={isEditModalVisible}
                    record={this.state.record}
                    onClose={this.hideModal}
                    onSuccess={this.handleSuccess}
                />)}
                {isDeleteModalVisible && (<DeleteStudentModal
                    isDeleteModalVisible={isDeleteModalVisible}
                    id={this.state.deleteId}
                    name={this.state.deleteName}
                    onClose={this.hideModal}
                    onSuccess={this.handleSuccess}
                />)}
                {isViewGroupsModalVisible && (<ViewGroupsOfTeacher
                    isViewGroupsModalVisible={isViewGroupsModalVisible}
                    name={this.state.studentName}
                    teacherId={this.state.viewGroupsId}
                    onClose={this.hideModal}
                />)}
            </Fragment>
        );
    }
}

export default ReadTeacher;