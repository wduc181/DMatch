import { Link } from 'react-router-dom';
import notFoundImg from '../assets/images/not-found.jpg';

const NotFoundPage = () => {
     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
               <div className="flex flex-col items-center text-center">
                    <img
                         src={notFoundImg}
                         alt="Không tìm thấy trang"
                         className="w-150 h-150 object-contain"
                    />
                    <p className="text-lg text-gray-500 mt-2 mb-6">Không tìm thấy nội dung!</p>
                    <Link
                         to="/"
                         className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                         Về Trang Chủ
                    </Link>
               </div>
          </div>
     );
};

export default NotFoundPage;
