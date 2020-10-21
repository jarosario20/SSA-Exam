<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();

        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $file = $request->file('photo');
        $validated = $request->validate([
            'prefixname' => 'nullable|string|max:255',
            'firstname' => 'required|string|min:1|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|min:1|max:255',
            'suffixname' => 'nullable|string|max:255',
            'username' => 'required|string|min:1|max:255|unique:users',
            'email' => 'required|email|min:1|max:255|unique:users',
            'password' => 'required|string|min:1',
            'photo' => 'nullable|mimes:jpeg,jpg,jpe,bmp,png,pdf,csv,xls,xlsx|max:2048',
            'type' => 'nullable|string|max:255',
        ]);

        if($validated) {
            DB::beginTransaction();
                try {
                    $validated['password'] = Hash::make($validated['password']);
                    
                    if($request->hasFile('photo')) {
                        $filename = $validated['username'] . '-' . $file->getClientOriginalName();
                        $destinationPath = 'public/photos';
                        $validated['photo'] = $filename;
                        // return $filename;
                        $file->storeAs($destinationPath, $filename);
                    }
                    // return $request;
                    User::create($validated);

                    DB::commit();
                    return response()->json('User successfully saved.', 201);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json($e->getMessage(), 400);
                }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json($user, 200);
        } 
        catch(ModelNotFoundException $e) {
            return response()->json(array("error" => "User record not found."), 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
        } 
        catch(ModelNotFoundException $e) {
            return response()->json(array("error" => "User record not found."), 404);
        }
        // return gettype($request->all());
        $file = $request->file('photo');
        $validated = $request->validate([
            'prefixname' => 'nullable|string|max:255',
            'firstname' => 'required|string|min:1|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|min:1|max:255',
            'suffixname' => 'nullable|string|max:255',
            'username' => 'required|string|min:1|max:255|unique:users,username,' . $id . ',id',
            'email' => 'required|email|min:1|max:255|unique:users,email,' . $id . ',id',
            'password' => 'required|string|min:1',
            'photo' => 'nullable|mimes:jpeg,jpg,jpe,bmp,png,pdf,csv,xls,xlsx|max:2048',
            'type' => 'nullable|string|max:255',
        ]);
        
        if ($validated) {
            DB::beginTransaction();
                try {
                    $validated['password'] = Hash::make($validated['password']);
                    
                    if($request->hasFile('photo')) {
                        $filename = $validated['username'] . '-' . $file->getClientOriginalName();
                        $destinationPath = 'public/photos';
                        $validated['photo'] = $filename;
                        
                        $file->storeAs($destinationPath, $filename);
                    }
                    $user->update($validated);

                    DB::commit();
                    return response()->json('User successfully updated.', 201);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json($e->getMessage(), 400);
                }
       }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id);
        } 
        catch(ModelNotFoundException $e) {
            return response()->json(array("error" => "User record not found."), 404);
        }
        
        if($user->trashed()) {
            DB::beginTransaction();
                try {
                    $user->forceDelete();

                    DB::commit();
                    return response()->json('User successfully deleted.', 201);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json($e->getMessage(), 400);
                }
        } else {
            return response()->json(array("error" => "This user is not yet in trashed."), 404);
        }
    }

    public function trashed($id)
    {
        try {
            $user = User::findOrFail($id);
        } 
        catch(ModelNotFoundException $e) {
            return response()->json(array("error" => "User record not found."), 404);
        }

        if($user->trashed()) {
            return response()->json(array("error" => "This user is already in trashed."), 404);
        } else {
            DB::beginTransaction();
                try {
                    $user->update(['deleted_at' => Carbon::now()]);

                    DB::commit();
                    return response()->json('User successfully move in trash.', 201);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json($e->getMessage(), 400);
                }
        }
    }

    public function restore($id)
    {
        try {
            $user = User::onlyTrashed()->findOrFail($id);
        } 
        catch(ModelNotFoundException $e) {
            return response()->json(array("error" => "User record not found."), 404);
        }

        if($user->trashed()) {
            DB::beginTransaction();
                try {
                    $user->restore();

                    DB::commit();
                    return response()->json('User successfully restored.', 201);
                } catch (Exception $e) {
                    DB::rollback();
                    return response()->json($e->getMessage(), 400);
                }
        } else {
            return response()->json(array("error" => "This user is not in trash."), 404);
        }
    }

    /**
    * Retrieve the default photo from storage.
    * Supply a base64 png image if the `photo` column is null.
    *
    * @return string
    */
    public function getAvatarAttribute($id): string
    {
        $user = User::findOrFail($id);
        
        if($user->photo !== NULL){
            $filename = $user->photo;
        } else {
            $filename = 'default-image.png';
        }
        $path = public_path() . '/storage/photos/' . $filename;
        
        if(file_exists($path)) {
            $type = pathinfo($path, PATHINFO_EXTENSION);
            $data = file_get_contents($path);
            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
            return response()->json($base64, 200);
        } else {
            return response()->json('File not found in the local storage.', 404);
        }
    }

    /**
    * Retrieve the user's full name in the format:
    *  [firstname][ mi?][ lastname]
    * Where:
    *  [ mi?] is the optional middle initial.
    *
    * @return string
    */
    public function getFullnameAttribute($id): string
    {
        $user = User::findOrFail($id);
        $acronym = "";
        if($user->middlename != "") {
            $middlename = explode(" ", $user->middlename);
            // return $middlename;
            foreach ($middlename as $mi) {
              $acronym .= $mi[0];
            }
        }

        $fullname = $user->firstname . ' ' . $acronym . ' ' . $user->lastname;
        return response()->json($fullname, 200);
    }
    
    /**
    * Retrieve the user's middle initial:
    *  E.g. "delos Santos" -> "D."
    * Where:
    *  [ mi?] is the optional middle initial.
    *
    * @return string
    */
    public function getMiddleinitialAttribute ($id): string
    {
        $user = User::findOrFail($id);
        if($user->middlename != "") {
            return response()->json(strtoupper($user->middlename[0]) . '.', 200);
        } else {
            return response()->json('No Middle name.', 400);
        }
    }

    public function trashlist()
    {
        $users = User::onlyTrashed()->get();

        return response()->json($users, 200);
    }

}
