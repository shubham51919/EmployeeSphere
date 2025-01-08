import { useEffect, useState } from "react";
import {
  Button,
  CloseIcon,
  Dialog,
  Flex,
  FlexItem,
  Input,
  Text,
  Dropdown,
  TextArea,
  Divider,
} from "@fluentui/react-northstar";
import ReactQuill from "react-quill";
import ToolbarOfEdit, { formats, modules } from "./ToolbarOfEdit";
import PreviewDialog from "../Requests/PreviewDialog";
import { useSelector } from "react-redux";
import newsroomApi from "../../../Apis/newsroom";
import { toast } from "react-toastify";

const EditDialog = ({ html, title, category, id, rerenderBlog, setRerenderBlog }) => {
  const [newHtml, setNewHtml] = useState(html);
  const [newTitle, setNewTitle] = useState(title);
  const [newCategory, setNewCategory] = useState(category);
  const [theme, setTheme] = useState();
  const CompanyReducer = useSelector((state) => state.CompanyReducer);
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);

  useEffect(() => {
    setTheme(CompanyReducer.theme);
  }, [CompanyReducer]);

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const formReducer = useSelector((state) => {
    return state.formReducer;
  });

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setNewCategory("");
    setNewHtml("");
    setNewTitle("");

  };
  const handleSubmit = async () => {
    try {
      const response = await API.post("/editABlog", {
        id: id,
        title: newTitle,
        content: newHtml,
        adminMail: userEmail,
        category: newCategory,
      })
      toast.success("Blog Successfully edited", {
        position: toast.POSITION.TOP_RIGHT,
      });
      handleClose();
      setRerenderBlog(!rerenderBlog);

    }
    catch {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const items = ["Editorials", "Reviews"];
  const handleDropdownChange = (item) => {
    setNewCategory(item);
  };
  const handleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const hanldeQuillChange = (value) => {
    setNewHtml(value);
  };

  return (
    <Dialog
      style={{
        maxHeight: "30rem",
        width: "70%",
      }}
      open={open}
      cancelButton={{
        content: "Cancel",
        onClick: handleClose,
      }}
      confirmButton={{
        content: "Confirm",
        onClick: handleSubmit,
      }}
      content={
        <>
          <Flex column gap="gap.small" className="format">
            <Dropdown
              placeholder="Select Category"
              getA11ySelectionMessage={{
                onAdd: (item) => handleDropdownChange(item),
              }}
              items={items}
              style={{
                width: "30%",
              }}
              defaultValue={newCategory}
            />
            <TextArea
              onChange={handleChange}
              value={newTitle}
              placeholder="Write heading"
            />
            <Flex
              className={`${theme == "default" ? `text-editor` : `text-dark-editor`
                }`}
              column
              style={{
                borderRadius: "0.5rem",
              }}
            >
              <ReactQuill
                theme="snow"
                value={newHtml}
                onChange={hanldeQuillChange}
                placeholder={"Write something here..."}
                modules={modules}
                formats={formats}
              />
              <ToolbarOfEdit />
            </Flex>
          </Flex>
          <Flex
            gap="gap.small"
            style={{
              justifyContent: "space-between",
            }}
          >
            <Flex>
              <PreviewDialog
                employeeEmail={userEmail}
                employeeName={formReducer.loggedInUserDetails.FirstName}
                editorHtml={newHtml}
                title={newTitle}
                category={newCategory}
                type="button"
              />
            </Flex>
          </Flex>
        </>
      }
      header={{
        content: "Edit your post",
      }}
      headerAction={{
        icon: <CloseIcon onClick={handleClose} />,
        title: "Close dialog",
      }}
      trigger={
        <Text
          content="Edit"
          onClick={() => setOpen(true)}
          style={{
            cursor: "pointer",
          }}
        />
      }
    />
  );
};

export default EditDialog;
