import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { bin } from "react-icons-kit/icomoon/bin";
import { pencilSquareO } from "react-icons-kit/fa/pencilSquareO";
import { externalLink } from "react-icons-kit/fa/externalLink";
import { plus } from "react-icons-kit/fa/plus";
import { Icon } from "react-icons-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import Load from "../components/Load";

const JurnalGuru = () => {
  const [result, setResult] = useState([]);
  const role = localStorage.getItem("role");
  async function fetchData() {
    try {
      const token = localStorage.getItem("access_token");
      let { data } = await axios({
        method: "get",
        url: `${process.env.BASE_URL}/${role}/jurnal-guru`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      setResult(data);
    } catch (error) {
      console.log(error);
    }
  }

  // -----------------------------------------------------DELETE
  function handdleDeletePopUp() {
    document.getElementById("my_modal_1").showModal();
  }

  function handdleDelete(id) {
    const token = localStorage.getItem("access_token");
    const response = axios({
      method: "delete",
      url: `${process.env.BASE_URL}/${role}/jurnal-guru/` + id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: "Data Terhapus",
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="m-auto w-full h-screen bg-green-100">
      <Navbar />
      <div className="text-gray-900  pb-10 bg-green-100 ">
        <div className="p-4  flex justify-center w-full  md:justify-start  bg-white sticky top-20 ">
          <div className="w-[700px] mt-3  flex justify-start gap-5  ">
            <Link to={"/jadwal"}>
              <button className="bg-green-500 hover:bg-green-700 px-5 py-2 rounded-md text-white ">
                Jadwal Pelajaran
              </button>
            </Link>
            <Link to={"/jurnal"}>
              <button className="bg-green-500 hover:bg-green-700 px-5 py-2 rounded-md text-white ">
                Jurnal Guru
              </button>
            </Link>
            <div className="px-5 py-2 font-bold text-2xl ml-12 underline bg-slate-200 rounded-sm ">
              Jurnal Guru
            </div>
          </div>

          <form className="mt-3 ml-80" action="">
            <input
              className="w-96 h-12 rounded-md px-4 outline-none border-2 border-slate-400 "
              type="text"
              placeholder="Cari Nama Guru"
            />
          </form>
        {localStorage.getItem("role") === "admin" && (
            <Link to={"/jurnal/add"}>
              <button className="btn w-[10rem] text-white bg-green-500 hover:bg-green-700 mt-3">
                <Icon icon={plus} /> Tambah Jurnal
              </button>
            </Link>
          )}
        </div>

        <div className="px-3 py-4 flex justify-center mt-16  ">
          <table className="w-full text-md bg-gray-100 shadow-2xl  mb-4 text-center">
            <thead className="sticky top-40 bg-green-500  ">
              <tr className="border-b  ">
                <th className="text-center p-3 px-5 ">No</th>
                <th className="text-center p-3 px-5">Tanggal</th>
                <th className="text-center p-3 px-5">Guru</th>
                <th className="text-center p-3 px-5">Guru Pengganti</th>
                <th className="text-center p-3 px-5">Jumlah JP</th>
                <th className="text-center p-3 px-5"></th>
                <th />
              </tr>
            </thead>

            {result ? (
              <>
                <tbody>
                  {result.map((item, index) => {
                    return (
                     
                        <tr key={index} className="border-b hover:bg-green-100 bg-gray-100 ">
                          <td className="p-3 px-5">{++index}</td>
                          <td className="p-3 px-5">{item?.createAt}</td>
                          <td className="p-3 px-5">{item?.guru?.nama}</td>
                          <td className="p-3 px-5">{item?.guruPengganti?.nama}</td>
                          <td className="p-3 px-5">5</td>
                          <td className="p-3 px-5 flex justify-center">
                            <Link to={"/ditailJurnalGuru/"+item._id}>
                              <button className="btn mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white">
                                <Icon icon={externalLink} /> Ditail
                              </button>
                            </Link>

                           <Link to={"/editJurnalGuru/"+item._id}> <button className="btn text-white bg-green-500 hover:bg-green-700 mr-2">
                              <Icon icon={pencilSquareO} /> Edit
                            </button></Link>

                            <button
                              className="btn bg-red-500 hover:bg-red-700 text-white"
                              onClick={() => handdleDeletePopUp()}
                            >
                              <Icon icon={bin} />
                              Hapus
                            </button>

                            <dialog id="my_modal_1" className="modal text-[#EEEEEE]">
                              <div className="modal-box bg-gray-800">
                                <h3 className="font-bold text-lg">
                                  Apakah yakin ingin menghapus data ini?
                                </h3>
                                <div className="modal-action">
                                  <form method="dialog">
                                    <button
                                      onClick={() => {
                                        handdleDelete(item._id);
                                      }}
                                      className="btn bg-red-500 hover:bg-red-700 text-white"
                                    >
                                      Hapus
                                    </button>
                                  </form>
                                  <form method="dialog">
                                    <button className="btn bg-green-500 hover:bg-green-700 text-white">
                                      Kembali
                                    </button>
                                  </form>
                                </div>
                              </div>
                            </dialog>
                          </td>
                        </tr>
                     
                    );
                  })}
                </tbody>
              </>
            ) : (
              <Load />
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default JurnalGuru;
