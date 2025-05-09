import React from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useCreateProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
const {pageNumber} = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber});
  const products = data?.products || [];
  const [createProduct, { isLoading: loadingCreate }] =useCreateProductMutation();

 const [deleteProduct, {isLoading: loadingDelete}]= useDeleteProductMutation();

  const deleteHandler = async (id) => {
   if(window.confirm('Are you sure?')) {
    try{
      await deleteProduct(id);
      refetch();
    }catch (err){
      toast.error(err?.data?.message || err.error);
  console.error(err)
    }
   }
  };
  const createProductHandler = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to create a new Product?")) {
      try {
        await createProduct().unwrap();
        refetch();
        toast.success("Product created successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Row>
          <Col>
            <h1>Products</h1>
          </Col>
          <Col className="text-end">
            <Button className="btn-sm m-3" onClick={createProductHandler}>
              <FaEdit /> Create Product
            </Button>
          </Col>
        </Row>
       {loadingCreate && <Loader />}
       {loadingDelete && <Loader />}
       
        {isLoading ? 
          <Loader />
         : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <Button value="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </>
        )}
      </Row>
    </>
  );
};

export default ProductListScreen;
