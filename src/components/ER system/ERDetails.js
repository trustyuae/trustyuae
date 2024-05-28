import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import DataTable from '../DataTable'
import { MDBCol, MDBRow } from 'mdb-react-ui-kit'
import { Avatar, Box, Typography } from '@mui/material'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { API_URL } from '../../redux/constants/Constants'
import { PerticularPoDetails } from '../../redux/actions/P2SystemActions'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ERDetails = () => {
    const dispatch = useDispatch();
    const [ERviewList, setERviewList] = useState([])
    const navigate = useNavigate();


    const fetchER = async () => {
        try {
            let apiUrl = `${API_URL}wp-json/custom-po-details/v1/po-order-details/${'PO23999'}`;
            await dispatch(PerticularPoDetails({ apiUrl })).then((response) => {
                let data = response.data.line_items.map((v, i) => ({ ...v, id: i }));
                data = data.map((v, i) => ({ ...v, dispatch_status: "Dispatched" }));
                console.log(data, 'data');
                setERviewList(data)
            });
        } catch {
            console.error("Error fetching PO:");
        }
    };

    const columns = [
        {
            field: "product_name",
            headerName: "Product Name",
            flex: 2,
        },
        {
            field: "image",
            headerName: "product Images",
            flex: 2,
            type: "html",
            renderCell: (params) => (
                <Box
                    className="h-100 w-100 d-flex align-items-center"
                //   onClick={() => ImageModule(params.value)}
                >
                    <Avatar
                        src={params.value || require("../../assets/default.png")}
                        alt="Product Image"
                        sx={{
                            height: "45px",
                            width: "45px",
                            borderRadius: "2px",
                            margin: "0 auto",
                            "& .MuiAvatar-img": {
                                height: "100%",
                                width: "100%",
                                borderRadius: "2px",
                            },
                        }}
                    />
                </Box>
            ),
        },
        {
            field: "quantity",
            headerName: "ER Qty",
            flex: 2,
            editable: true,
            type: 'number',
        },
        {
            field: "type",
            headerName: "Type",
            flex: 2,
        },
        {
            field: "received_status",
            headerName: "Received Status",
            flex: 2,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Market', 'Finance', 'Development'],
        },
        {
            field: "delivery_date",
            headerName: "Delivery Date",
            flex: 2,
            type: 'date',
            width: 180,
            editable: true,
        },
    ]

    const handalBackButton = () => {
        navigate("/ER_Management_System");
    };

    const handleUpdate =()=>{
        console.log(ERviewList,'ERviewList');
    }

    const handleSOQtyChange =(params)=>{
        console.log(params,'params');
        const updatedRows = ERviewList.map((row) => {
            if (row.id === params.id) {
                return { ...row, ...params };
            }
            return row;
        });
        setERviewList(updatedRows);
    }
    useEffect(() => {
        fetchER()
    }, [])

    return (
        <Container fluid className="px-5">
            <MDBRow className="my-3">
                <MDBCol className="d-flex justify-content-between align-items-center">
                    <Button
                        variant="outline-secondary"
                        className="p-1 me-2 bg-transparent text-secondary"
                        onClick={handalBackButton}
                    >
                        <ArrowBackIcon className="me-1" />
                    </Button>
                </MDBCol>
            </MDBRow>
            <Card className="p-3 mb-3">
                <Box className="d-flex align-items-center justify-content-between">
                    <Box>
                        <Typography variant="h6" className="fw-bold mb-3">
                            ER view
                        </Typography>
                        <Box>
                            <Typography className="fw-bold">
                                {/* PO Number */}# ER No. 1234
                            </Typography>
                        </Box>
                        <Typography
                            className=""
                            sx={{
                                fontSize: 14,
                            }}
                        >
                            {/* <Badge bg="success">{POTypes(id)}</Badge> */}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" className="fw-bold mb-3">
                            {/* {
                                factories.find((factory) => factory.id == factorieName)
                                    ?.factory_name
                            } */}
                            xyz Factory
                        </Typography>
                    </Box>
                </Box>
            </Card>
            <Card className="p-3 mb-3">
                <Row className="mb-3">
                    <Col xs="auto" lg="4">
                        <Form.Group className="fw-semibold mb-0">
                            <Form.Label>Status Filter:</Form.Label>
                            <Form.Select

                                className="mr-sm-2"
                            // value={selectedFactory}
                            // onChange={(e) => handlepayMentStatus(e)}
                            >
                                {/* <option value="">All </option> */}
                                <option value="In Progress">In Progress </option>
                                <option value="Closed">Closed </option>
                                {/* {paymentS.map((po) => (
                                    <option key={po} value={po}>
                                        {po}
                                    </option>
                                ))} */}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <MDBRow className="d-flex justify-content-center align-items-center">
                    <MDBCol col="10" md="12" sm="12"></MDBCol>

                    {/* {perticularOrderDetailsLoader ? (
                        <Loader />
                    ) : (
                        <div className="mt-2">
                            <DataTable
                                columns={columns}
                                rows={PO_OrderList}
                                // page={pageSO}
                                // pageSize={pageSizeSO}
                                // totalPages={totalPagesSO}
                                rowHeight={100}
                            // handleChange={handleChangeSO}
                            // // onCellEditStart={handleCellEditStart}
                            // processRowUpdate={processRowUpdateSPO}
                            />
                        </div>
                    )} */}
                    <div className="mt-2">
                        <DataTable
                            columns={columns}
                            rows={ERviewList}
                        // page={pageSO}
                        // pageSize={pageSizeSO}
                        // totalPages={totalPagesSO}
                        // rowHeight={100}
                        // handleChange={handleChangeSO}
                        // // onCellEditStart={handleCellEditStart}
                        processRowUpdate={handleSOQtyChange}
                        />
                    </div>
                    <Row>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Add Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                            //   onChange={(e) => setManualNote(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Button type="button" className="w-auto"
                        onClick={handleUpdate}
                        >
                            Update
                        </Button>
                    </Row>
                </MDBRow>
            </Card>
        </Container>
    )
}

export default ERDetails