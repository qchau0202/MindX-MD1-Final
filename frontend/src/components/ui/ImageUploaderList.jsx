import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, X as RemoveIcon } from "lucide-react";
import { message } from "antd";

const ImageUploaderList = ({
  fileList,
  onChange,
  maxCount = 1,
  title,
  description,
}) => {
  const isSingle = maxCount === 1;

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        message.error("Some files were rejected. Please check the file types.");
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign({}, file, {
          preview: URL.createObjectURL(file),
          originFileObj: file,
        })
      );

      if (isSingle) {
        onChange({ fileList: newFiles.slice(0, 1) });
      } else {
        const combined = [...fileList, ...newFiles].slice(0, maxCount);
        onChange({ fileList: combined });
      }
    },
    [fileList, maxCount, isSingle, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: !isSingle,
    maxFiles: maxCount,
  });

  const removeImage = (index) => {
    const updatedList = fileList.filter((_, i) => i !== index);
    onChange({ fileList: updatedList });
  };

  return (
    <div className="w-full">
      {title && (
        <h1 className="text-lg font-semibold text-gray-900 mb-2">{title}</h1>
      )}

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 cursor-pointer transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${isSingle ? "h-64" : "min-h-[160px] p-4"}`}
      >
        <input {...getInputProps()} />

        {fileList.length > 0 ? (
          isSingle ? (
            <div className="relative w-full h-full">
              <img
                src={fileList[0].preview}
                alt="uploaded"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(0)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              >
                <RemoveIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 w-full justify-center">
              {fileList.map((file, index) => (
                <div key={index} className="relative w-[120px] h-[120px]">
                  <img
                    src={file.preview}
                    alt={`uploaded-${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full"
                  >
                    <RemoveIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-4">
            <ImageIcon className="w-10 h-10 mb-2" />
            <p className="text-sm font-medium">
              Drag & drop your images here, or click to select files
            </p>
            {description && (
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploaderList;