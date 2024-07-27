import React, { useEffect, useState } from "react";
import { bin } from "react-icons-kit/icomoon/bin";
import { pencilSquareO } from "react-icons-kit/fa/pencilSquareO";
import { externalLink } from "react-icons-kit/fa/externalLink";
import { plus } from "react-icons-kit/fa/plus";
import { Icon } from "react-icons-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import Load from "../components/Load";
import Swal from "sweetalert2";

const JurnalGuru = ({isProfile=false,id=false, addons=false}) => {
  const [result, setResult] = useState([]);
  const role = localStorage.getItem("role");
  const [from, setFrom] = useState(new Date().toISOString().slice(0, 7));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 7));
  const [idJurnal, setIdJurnal] = useState(null);

  async function fetchData() {
    try {
      const token = localStorage.getItem("access_token");
      console.log(id);
      const link = id ? `${role}/filter/jurnal-guru/guru/${id}` : `${role}/jurnal-guru`;
      console.log(`${process.env.BASE_URL}/${link}`);
      let { data } = await axios({
        method: "get",
        url: `${process.env.BASE_URL}/${link}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      setResult(data);
      console.log(addons)
    } catch (error) {
      console.log(error);
    }
  }

  const filterByDate = async () => {
    try {
      setResult([]);
      const token = localStorage.getItem("access_token");
      console.log(from,"AAAAAAAAAAAA");
      const query = `?from=${from}&to=${to}`;
      const link = `${process.env.BASE_URL}/${role}/filter/jurnal-guru/date/${id ? `${id+'/'}`:'/'}${query}`
      let { data } = await axios({
        method: "get",
        url: link,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      setResult(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  function handdleDeletePopUp(idJurnal) {
    setIdJurnal(idJurnal);
    document.getElementById("my_modal_1").showModal();
  }

  async function handdleDelete() {
    const token = localStorage.getItem("access_token");
    const link = `${process.env.BASE_URL}/${role}/jurnal-guru/` + idJurnal
    const response = await axios({
      method: "delete",
      url: link,
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
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="m-auto w-full h-screen bg-green-100">
      <div className="text-gray-900 bg-green-100">
              <div className={`p-4 gap-10  flex justify-center w-full  md:justify-end sticky top-20 bg-white  `}>
        {addons && addons}
    
        <div className="flex justify-end gap-1 w-[80%] items-center ">
          <p className="bg-green-500 text-[#184210] font-bold p-2 rounded-xl"> 
            From  : <input type="month" className="p-1 rounded-3xl bg-green-400" onChange={(e)=>setFrom(e.target.value)} value={from}/>
          </p>
          <p className="bg-green-500 text-[#184210] font-bold p-2 rounded-xl">
            To  :  <input type="month" className="p-1 rounded-3xl bg-green-400" onChange={(e)=>setTo(e.target.value)} value={to}/>
          </p>

        <div className="w-[20%] self-center">
          <button className="p-3 rounded-xl bg-green-500 text-[#184210]" onClick={()=>filterByDate()}>Set Filter</button>
        </div>
        </div>
        
        {!isProfile &&  
        <form className="mt-3 " action="">
            <input
              className="w-96 h-12 rounded-md px-4 outline-none border-2 border-slate-400 "
              type="text"
              placeholder="Cari Nama Guru"
            />
        </form>
        }
 
        
        {localStorage.getItem("role") === "admin" && (
            <Link to={"/jurnal/add"}>
              <button className="btn w-[10rem] text-white bg-green-500 hover:bg-green-700 mt-3">
                <Icon icon={plus} /> Tambah Jurnal
              </button>
            </Link>
          )}
        </div>
        




        
        <div className="px-3 flex justify-center  ">
          <table className="w-full text-md bg-gray-100 shadow-2xl  mb-4 text-center overflow-x-scroll">
            <thead className={` bg-green-500 sticky top-40`} >
              <tr className="border-b  ">
                <th className="text-center p-3 px-5 ">No</th>
                <th className="text-center p-3 px-5">Tanggal</th>
                <th className="text-center p-3 px-5">Guru</th>
                <th className="text-center p-3 px-5">Kelas</th>
                <th className="text-center p-3 px-5">Guru Pengganti</th>
                <th className="text-center p-3 px-5">Jam Ke</th>
                <th className="text-center p-3 px-5">Jumlah JP</th>
                <th className="text-center p-3 px-5"></th>
                <th />
              </tr>
            </thead>

            {result ? (
              <>
                <tbody>
                  {result?.map((item, index) => {
                    return (
                     
                        <tr key={index} className="border-b hover:bg-green-100 bg-gray-100 ">
                          <td className="p-3 px-5">{++index}</td>
                          <td className="p-3 px-5">{item?.createAt}</td>
                          <td className="p-3 px-5">{item?.guru?.nama}</td>
                          <td className="p-3 px-5">{item?.kelas}</td>
                          <td className="p-3 px-5">{item?.guruPengganti?.nama}</td>
                          <td className="p-3 px-5">{item?.jamKe}</td>
                          <td className="p-3 px-5">{item?.jumlahJP}</td>
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
                              onClick={() => handdleDeletePopUp(item._id)}
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
                                        handdleDelete();
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
